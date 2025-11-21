export default function Contact() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <form className="space-y-4">
        <input type="text" placeholder="Your Name" className="border p-2 w-full rounded" />
        <input type="email" placeholder="Your Email" className="border p-2 w-full rounded" />
        <textarea placeholder="Your Message" className="border p-2 w-full rounded"></textarea>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}
