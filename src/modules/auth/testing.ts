/** Test-only public surface of the auth module. Never import from application code. */
export { resetSchoolCodeStoreForTests, schoolCodeStore } from './school-code-store';
export {
  clearSession,
  resetSessionStoreForTests,
  sessionStore,
  startSession,
} from './session-store';
