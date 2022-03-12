import { useLoaderData, Link, redirect } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import moment from "moment";
export const loader = async ({ params, request }) => {
    const user = await getUser(request)
    const post = await db.post.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            comments: {
                include: { user: true }
            }
        },
    });
    const data = { post, user };
    return data
}
function Post() {
    const { post, user } = useLoaderData();
    return (
        <div>
            <div className="page-header">
                <h1>{post.title}</h1>
            </div>
            <h2>Written By {post.user.username}</h2>
            <br />
            <div className="page-content">
                <p className="post-content">{post.body}</p>
            </div>
            <div className="page-footer">
                {user && user.id === post.userId && (
                    <>
                        <Link to={`/posts/update/${post.id}`} className="btn">
                            <i className="fas fa-edit"></i>
                        </Link>
                        <form method='POST' action={`/posts/delete/${post.id}`}>
                            <button className='btn' type="submit">
                                <i className="far fa-trash-alt"></i>
                            </button>
                        </form>
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
                        {post.comments.map(comment => (
                            <p className="post-content">
                                <span className="comment-user">
                                    {comment.user.username}
                                </span>
                                <span className="comment-time">
                                    {moment(comment.createdAt).format('LL')}
                                </span>
                                <span className="comment-content">
                                    {comment.body}
                                </span>
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
