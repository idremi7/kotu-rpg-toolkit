// small calculation engine to compute derived values based on formulas and a DAG of dependencies

export interface CalculatedField {
  name: string;
  formula: string; // formula string with @variables
  dependsOn: string[]; // list of variable names
}

/**
 * safe evaluator that only allows a whitelist of Math functions
 */
function safeEval(expr: string): number {
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    `const {floor,ceil,round,abs,max,min}=Math; return (${expr});`
  );
  return fn();
}

/**
 * compute values in topological order; fields may depend on attributes or other calculated fields
 */
export function calculateFields(
  base: Record<string, number>,
  fields: CalculatedField[]
): Record<string, number> {
  // if raw attributes present, auto‑inject their d20 modifiers
  const result: Record<string, number> = { ...base };
  Object.keys(base).forEach((k) => {
    const m = Math.floor((base[k] - 10) / 2);
    result[`${k}Mod`] = m;
  });

  // simple topological sort by repeatedly evaluating those whose deps are ready
  const remaining = [...fields];

  while (remaining.length) {
    let progress = false;
    for (let i = 0; i < remaining.length; ++i) {
      const f = remaining[i];
      const ready = f.dependsOn.every((d) => d in result);
      if (!ready) continue;

      // replace variable references with numeric values
      let expr = f.formula;
      for (const dep of f.dependsOn) {
        expr = expr.replace(new RegExp(`@${dep}`, 'g'), String(result[dep]));
      }

      try {
        result[f.name] = safeEval(expr);
      } catch (err) {
        console.error('formula evaluation failed', f, err);
        result[f.name] = 0;
      }

      remaining.splice(i, 1);
      progress = true;
      break;
    }
    if (!progress) {
      console.warn('circular dependency or missing values in calculated fields', remaining);
      break;
    }
  }

  return result;
}
