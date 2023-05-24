"use client";

import { useState, Fragment } from "react";

type Props = {
  text: String;
};

export default function Meeting({ text }: Props) {
  const [data, setData] = useState("");
  const [api, setApiKey] = useState("");

  const fetchData = async () => {
    setData("");

    const res = await fetch("/api/summarize", {
      method: "POST",
      body: JSON.stringify({
        text: text,
        api: api,
      }),
    });

    const data = res.body;

    if (!data) {
      return;
    }

    const reader = data.getReader();

    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunkValue = decoder.decode(value);

      setData((prev) => prev + chunkValue);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="block text-6xl text-center my-9 font-medium text-gray-700">
          LangChain × Next.js Test
        </div>
      </div>
      <div>
        <label
          htmlFor="apiKey"
          className="block mb-3 text-lg font-medium text-gray-700"
        >
          OpenAI API Key
        </label>
        <input
          id="apiKey"
          value={api}
          placeholder="Enter OpenAI api key.."
          className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
      </div>
      <button
        onClick={fetchData}
        disabled={!api} // button will be disabled if API key input is empty
        className={`py-2 px-4 rounded-md text-white ${
          api
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-200 cursor-not-allowed"
        }"`}
      >
        Summarize
      </button>
      <div className="mt-4 p-2 border border-gray-200 rounded-md">
        <h2 className="text-lg font-semibold text-gray-700">Summary</h2>
        <p className="mt-2 text-gray-700">
          {data.split(/\n/).map((item, index) => {
            return (
              <Fragment key={index}>
                {item}
                <br />
              </Fragment>
            );
          })}
        </p>
      </div>
    </div>
  );
}