import { useLoaderData, Link, redirect } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
export const loader = async ({ params, request }) => {
    const user = await getUser(request)
    const post = await db.post.findUnique({
        where: { id: params.id },
    });
    const comments = await db.comment.findMany({
        where: { postId: params.id }
    });
    const author = await db.user.findUnique({
        where: { id: post.userId }
    });
    const data = { post, user, comments, author };
    return data
}
export const action = async ({ request, params }) => {
    const form = await request.formData()
    const post = await db.post.findUnique({
        where: { id: params.id },
    })
    const user = await getUser(request)
    if (form.get('_method') === 'delete') {
        if (user && post.userId === user.id) {
            await db.post.delete({ where: { id: params.id } })
        }
        return redirect('/posts')
    }
}
function Post() {
    const { post, user, comments, author } = useLoaderData();
    return (
        <div>
            <div className="page-header">
                <h1>{post.title}</h1>
            </div>
            <h2>Written By {author.username}</h2>
            <br />
            <div className="page-content">
                <p className="post-content">{post.body}</p>
            </div>
            <div className="page-footer">
                {user && user.id === post.userId && (
                    <>
                        <form method='POST'>
                            <input type='hidden' name='_method' value='delete' />
                            <button className='btn'><i className="far fa-trash-alt"></i></button>
                        </form>
                        <Link to={`/posts/update/${post.id}`} className="btn">
                            <i className="fas fa-edit"></i>
                        </Link>
                        <form method='POST' action={`/posts/${post.id}/like`}>
                            <button className='btn' type="submit">
                                <i class="fas fa-thumbs-up icon-right"></i>{post.likes}
                            </button>
                        </form>
                    </>
                )}
            </div>
            {user && user.id === post.userId && (
                <>
                    <br />
                    <div className="post-content">
                        <form method='POST' action={`/posts/${post.id}/comment`}>
                            <div className="form-control">
                                <h2><label htmlFor="comment">Add Comment : </label></h2>
                                <input type="text" name="comment" id="comment" required />
                            </div>
                            <button className='btn' type="submit">Add <i class="fas fa-plus icon"></i></button>
                        </form>
                        <br />
                        <h2>Comments</h2>
                        {comments.map(comment => (
                            <p className="post-content">
                                <span className="comment-user">{comment.username}</span>
                                {comment.body}
                            </p>
                        ))}
                    </div>
                    <br />
                </>
            )}

        </div>
    );
}

export default Post;
