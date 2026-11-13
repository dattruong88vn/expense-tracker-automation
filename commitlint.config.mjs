/**
 * Conventional Commits with the project rule that the subject begins with the
 * Jira key (for example `test(automation): ET-40 ...`), hence subject-case is off.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0],
  },
};
