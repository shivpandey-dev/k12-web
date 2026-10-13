/** Test-only public surface of the auth module. Never import from application code. */
export { resetSessionStoreForTests, sessionStore, startSession } from './session-store';
