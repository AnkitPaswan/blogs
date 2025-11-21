import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
      <p className="text-sm text-gray-600 mb-3">{blog.excerpt}</p>
      <Link
        to={`/blog/${blog.id}`}
        className="text-blue-600 text-sm font-medium hover:underline"
      >
        Read More
      </Link>
    </div>
  );
}
