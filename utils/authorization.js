import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import { jwtDecode } from "jwt-decode";
import env from "../config/keys.js";


const checkJwt = auth({
	audience: "http://localhost:8888",
	issuerBaseURL: `https://${env.auth0Domain}/`,
});

const checkScopes = (scopes) => requiredScopes(scopes);

function checkUser(req, res, next) {
	const decodedJwt = jwtDecode(req.headers.authorization.split(' ')[1]);
	
	if (req.params.id !== decodedJwt.sub) {
		return res.status(403).send('Forbidden');
	}

	next();
}

export { checkJwt, checkScopes, checkUser };