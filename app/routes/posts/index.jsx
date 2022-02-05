import { useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
export const loader = async ({ request }) => {
    const data = {
        posts: await db.post.findMany({
            orderBy: { createdAt: 'desc' },
            select: { title: true, id: true, createdAt: true, updatedAt: true, user: true },
        }),
        user: await getUser(request),
    };
    return data;
}
function PostItems() {
    const { posts, user } = useLoaderData();
    return (
        <>
            <div className="page-header">
                <h1>Posts</h1>
                {(user === null) ? null : <Link to="/posts/new" className="btn">New Post</Link>}
            </div>
            <ul className="posts-list">
                {posts.map(post => (
                    <li key={post.id}>
                        <Link to={post.id}>
                            <h3>{post.title}</h3>
                            Created At - {new Date(post.createdAt).toLocaleDateString()}<br />
                            Last Updated At - {new Date(post.updatedAt).toLocaleTimeString()} , {new Date(post.updatedAt).toLocaleDateString()}<br />
                            Written By - {post.user.username}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default PostItems;
