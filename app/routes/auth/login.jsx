import { createUserSession, login, register } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { useActionData, redirect, json } from 'remix'
function badRequest(data) {
    return json(data, { status: 400 })
}
export const action = async ({ request }) => {
    const form = await request.formData();
    const authType = form.get('authType');
    const username = form.get('username').trim();
    const password = form.get('password').trim();
    const fields = { authType, username, password };
    switch (authType) {
        case 'register': {
            const userExists = await db.user.findFirst({
                where: {
                    username,
                },
            })
            if (userExists) return badRequest({ fields, error: 'User Already Exists !' });
            const user = await register({ username, password })
            return createUserSession(user.id, '/posts')
        }
        case 'login': {
            const user = await login({ username, password })
            if (!user) return badRequest({ fields, error: 'There was a problem with your login !' });
            return createUserSession(user.id, '/posts')
        }
    }
    return redirect('/posts')
}
function Login() {
    const actionData = useActionData()
    return (
        <div className="auth-container">
            <div className="page-header">
                <h1>Register / Login</h1>
            </div>
            <div className='error'>
                {actionData?.error ? (
                    <p
                        className='form-validation-error'
                        role='alert'
                        id='username-error'
                    >
                        {actionData.error}
                    </p>
                ) : null}
            </div>
            <br />
            <div className="page-content">
                <form method="post">
                    <fieldset>
                        <legend>
                            Register / Login
                        </legend>
                        <label>
                            <input type="radio" name="authType" value="register" required defaultChecked={actionData?.fields?.authType === 'register'} /> Register
                        </label>
                        <label>
                            <input type="radio" name="authType" value="login" required defaultChecked={
                                !actionData?.fields?.authType ||
                                actionData?.fields?.authType === 'login'
                            } /> Login
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
