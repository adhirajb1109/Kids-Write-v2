import { createUserSession, login, register } from "~/utils/session.server";
import { db } from "~/utils/db.server";
export const action = async ({ request }) => {
    const form = await request.formData();
    const authType = form.get('authType');
    const username = form.get('username').trim();
    const password = form.get('password').trim();
    switch (authType) {
        case 'register': {
            const userExists = await db.user.findFirst({
                where: {
                    username,
                },
            })
            if (userExists) return null;
            const user = await register({ username, password })
            return createUserSession(user.id, '/posts')
        }
        case 'login': {
            const user = await login({ username, password })
            if (!user) return null;
            return createUserSession(user.id, '/posts')
        }
    }
}
function Login() {
    return (
        <div className="auth-container">
            <div className="page-header">
                <h1>Register / Login</h1>
            </div>
            <div className="page-content">
                <form method="post">
                    <fieldset>
                        <legend>
                            Register / Login
                        </legend>
                        <label>
                            <input type="radio" name="authType" value="register" /> Register
                        </label>
                        <label>
                            <input type="radio" name="authType" value="login" /> Login
                        </label>
                    </fieldset>
                    <div className="form-control">
                        <label htmlFor="username">Username :</label>
                        <input type="text" name="username" id="username" required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password :</label>
                        <input type="password" name="password" id="password" required />
                    </div>
                    <button className="btn btn-block" type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;
