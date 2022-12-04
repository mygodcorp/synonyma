function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid items-center h-screen p-6">
        <div className="flex justify-center items-center flex-col">
          <div className="max-w-xl w-full">
            <input
              type="text"
              name="name"
              id="name"
              className="block h-12 w-full rounded-full bg-gray-100  border-none px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Aimer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
