/**
 * Flow Validator
 *
 * Run this to validate your flow JSON files before generating videos.
 *
 * Usage:
 *   tsx scripts/validate-flow.ts flows/my-flow.json
 */

import * as fs from "fs";
import * as path from "path";
import { log } from "./logger.js";
import type { FlowConfig, FlowStep } from "./types.js";

const VALID_ACTIONS = [
  "goto",
  "click",
  "fill",
  "type",
  "wait",
  "waitForSelector",
  "screenshot",
  "hover",
  "press",
  "selectOption",
  "scroll",
];

interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

function validateFlow(flowPath: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check file exists
  if (!fs.existsSync(flowPath)) {
    errors.push({
      path: flowPath,
      message: "Flow file does not exist",
      severity: "error",
    });
    return errors;
  }

  // Parse JSON
  let flow: FlowConfig;
  try {
    const content = fs.readFileSync(flowPath, "utf-8");
    flow = JSON.parse(content);
  } catch (err) {
    errors.push({
      path: flowPath,
      message: `Invalid JSON: ${(err as Error).message}`,
      severity: "error",
    });
    return errors;
  }

  // Validate required fields
  if (!flow.name) {
    errors.push({
      path: "name",
      message: 'Missing required field "name"',
      severity: "error",
    });
  }

  if (!flow.title) {
    errors.push({
      path: "title",
      message: 'Missing required field "title"',
      severity: "error",
    });
  }

  if (!flow.steps || !Array.isArray(flow.steps)) {
    errors.push({
      path: "steps",
      message: 'Missing or invalid "steps" array',
      severity: "error",
    });
    return errors;
  }

  if (flow.steps.length === 0) {
    errors.push({
      path: "steps",
      message: "Steps array is empty - at least one step required",
      severity: "error",
    });
  }

  // Validate each step
  flow.steps.forEach((step: FlowStep, index: number) => {
    const stepPath = `steps[${index}]`;

    if (!step.action) {
      errors.push({
        path: `${stepPath}.action`,
        message: 'Missing "action" field',
        severity: "error",
      });
      return;
    }

    if (!VALID_ACTIONS.includes(step.action)) {
      errors.push({
        path: `${stepPath}.action`,
        message: `Invalid action "${step.action}". Valid actions: ${VALID_ACTIONS.join(", ")}`,
        severity: "error",
      });
    }

    // Action-specific validation
    switch (step.action) {
      case "goto":
        if (!("url" in step) || !(step as any).url) {
          errors.push({
            path: `${stepPath}.url`,
            message: 'goto action requires "url" field',
            severity: "error",
          });
        }
        break;

      case "click":
      case "hover":
      case "waitForSelector":
        if (!("selector" in step) || !(step as any).selector) {
          errors.push({
            path: `${stepPath}.selector`,
            message: `${step.action} action requires "selector" field`,
            severity: "error",
          });
        }
        break;

      case "fill":
      case "type":
        if (!("selector" in step) || !(step as any).selector) {
          errors.push({
            path: `${stepPath}.selector`,
            message: `${step.action} action requires "selector" field`,
            severity: "error",
          });
        }
        if (!("value" in step) || !(step as any).value) {
          errors.push({
            path: `${stepPath}.value`,
            message: `${step.action} action requires "value" field`,
            severity: "error",
          });
        }
        break;

      case "wait":
        if (!("ms" in step) || typeof (step as any).ms !== "number") {
          errors.push({
            path: `${stepPath}.ms`,
            message: 'wait action requires numeric "ms" field',
            severity: "error",
          });
        }
        break;

      case "press":
        if (!("selector" in step) || !(step as any).selector) {
          errors.push({
            path: `${stepPath}.selector`,
            message: 'press action requires "selector" field',
            severity: "error",
          });
        }
        if (!("key" in step) || !(step as any).key) {
          errors.push({
            path: `${stepPath}.key`,
            message: 'press action requires "key" field',
            severity: "error",
          });
        }
        break;

      case "selectOption":
        if (!("selector" in step) || !(step as any).selector) {
          errors.push({
            path: `${stepPath}.selector`,
            message: 'selectOption action requires "selector" field',
            severity: "error",
          });
        }
        if (!("value" in step) || !(step as any).value) {
          errors.push({
            path: `${stepPath}.value`,
            message: 'selectOption action requires "value" field',
            severity: "error",
          });
        }
        break;
    }

    // Warnings for best practices
    if (!step.name) {
      errors.push({
        path: `${stepPath}.name`,
        message: 'Consider adding a "name" field for better video labels',
        severity: "warning",
      });
    }

    if (
      step.action !== "wait" &&
      step.action !== "screenshot" &&
      !step.delayAfter
    ) {
      errors.push({
        path: `${stepPath}.delayAfter`,
        message: 'Consider adding "delayAfter" to allow UI to settle',
        severity: "warning",
      });
    }
  });

  // Check for first goto
  if (flow.steps.length > 0 && flow.steps[0].action !== "goto") {
    errors.push({
      path: "steps[0]",
      message: 'First step should usually be a "goto" action',
      severity: "warning",
    });
  }

  // Check baseUrl
  if (!flow.baseUrl && !process.env.BASE_URL) {
    errors.push({
      path: "baseUrl",
      message: "No baseUrl in flow and no BASE_URL in environment",
      severity: "warning",
    });
  }

  return errors;
}

// CLI
if (
  import.meta.url.endsWith(process.argv[1]!) ||
  process.argv[1]?.endsWith("validate-flow.ts")
) {
  const args = process.argv.slice(2);
  const flowPath = args[0];

  if (!flowPath) {
    log.error("Usage: tsx scripts/validate-flow.ts <path/to/flow.json>");
    process.exit(1);
  }

  log.bold("🔍 Flow Validator");
  log.divider();
  log.info(`Validating: ${flowPath}`);
  log.divider();

  const errors = validateFlow(flowPath);

  const criticalErrors = errors.filter((e) => e.severity === "error");
  const warnings = errors.filter((e) => e.severity === "warning");

  if (criticalErrors.length === 0 && warnings.length === 0) {
    log.success("✅ Flow is valid!");
    log.divider();
    process.exit(0);
  }

  if (criticalErrors.length > 0) {
    log.error(`Found ${criticalErrors.length} error(s):`);
    log.divider();
    criticalErrors.forEach((err) => {
      log.error(`  ${err.path}: ${err.message}`);
    });
    log.divider();
  }

  if (warnings.length > 0) {
    log.warn(`Found ${warnings.length} warning(s):`);
    log.divider();
    warnings.forEach((warn) => {
      log.warn(`  ${warn.path}: ${warn.message}`);
    });
    log.divider();
  }

  if (criticalErrors.length > 0) {
    log.error("❌ Flow has errors - please fix before generating video");
    process.exit(1);
  } else {
    log.success("✅ Flow is valid (with warnings)");
    process.exit(0);
  }
}

export { validateFlow };
