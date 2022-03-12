import { redirect } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
export const loader = async ({ request }) => {
    const user = await getUser(request);
    if (user === null) throw new Response("Unauthorized", { status: 401 });
    return {};
}
export const action = async ({ request }) => {
    const form = await request.formData();
    const title = form.get('title');
    const body = form.get('body');
    const user = await getUser(request);
    const fields = { title, body };
    const post = await db.post.create({ data: { userId: user.id, ...fields } });
    return redirect(`/posts/${post.id}`);
}
function NewPost() {
    return (
        <>
            <div className="page-header">
                <h1>New Post</h1>
            </div>
            <div className="page-content">
                <form method="post">
                    <div className="form-control">
                        <label htmlFor="title">Title :</label>
                        <input type="text" name="title" id="title" required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="body">Body :</label>
                        <textarea name="body" id="body" rows="10" required></textarea>
                    </div>
                    <button type="submit" className="btn btn-block">
                        Add <i class="fas fa-plus icon"></i>
                    </button>
                </form>
            </div>
        </>
    );
}

export default NewPost;
