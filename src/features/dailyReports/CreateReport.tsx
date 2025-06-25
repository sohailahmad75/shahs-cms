export default function CreateReport() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create New Report</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Title" className="w-full border p-2" />
        <textarea placeholder="Report Details" className="w-full border p-2" rows={5} />
        <button className="bg-blue-600 text-white px-4 py-2" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
