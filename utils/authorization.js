import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
	audience: "http://localhost:8888",
	issuerBaseURL: "https://dev-b8qw0pac72kuwxyk.eu.auth0.com/",
});