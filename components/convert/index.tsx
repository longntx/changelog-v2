import { Signal } from "@preact/signals-react";
import { TSource } from "@/pages/index.d";
import { source, sourcePrefix } from "@/pages";

type TConvert = {
  source: Signal<TSource>;
  sourceNumber: Signal<number>;
};
export const Convert = () => {
  console.log("render");
  const handleOnClick = () => {
    source.value = { ...source.value, ...{ prefix: "No Render" } };
  };
  return (
    <div className="flex flex-col h-[inherit]">
      <div className="basis-[250px]">
        <form name="basic" className="grid grid-rows-3">
          <div className="w-full">
            <label htmlFor="projectPrefix">Project Prefix</label>
            <br />
            <input
              id="projectPrefix"
              className="mt-3 border w-[inherit] rounded-md p-2 resize-none focus:border-blue-500 outline-0 placeholder:accent-gray-600 text-gray-700"
              placeholder="Project Prefix. EG: FTD"
              name="projectId"
            />
          </div>
          <div className="w-full mt-1">
            <label htmlFor="projectPrefix">Repo Pull Requests URL</label>
            <br />
            <input
              id="projectPrefix"
              className="mt-3 border w-[inherit] rounded-md p-2 resize-none focus:border-blue-500 outline-0 placeholder:accent-gray-600 text-gray-700"
              placeholder="Repo Pull Requests URL. Eg: https://bitbucket.org/est-rouge/ftd-admin-console/pull-requests/"
              name="projectPRsUrl"
            />
          </div>
          <div className="w-full mt-3">
            {/*<button*/}
            {/*  type="button"*/}
            {/*  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"*/}
            {/*  onClick={() =>*/}
            {/*    (source.value = { ...source.value, ...{ prefix: "ABCD" } })*/}
            {/*  }*/}
            {/*>*/}
            {/*  Convert*/}
            {/*</button>*/}
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={handleOnClick}
            >
              Convert
            </button>
          </div>
        </form>
      </div>
      <form className="grid grid-cols-3 gap-4 basis-full">
        <div className="h-[inherit] flex flex-col">
          <h2 className="basis-[30px]">Raw</h2>
          <textarea
            name="raw"
            className="basis-full border rounded-md p-2 resize-none focus:border-blue-500 outline-0"
          ></textarea>
        </div>

        <div className="h-[inherit] flex flex-col">
          <h2 className="basis-[30px]">For Dev</h2>
          <textarea
            name="layer1"
            className="basis-full border rounded-md p-2 resize-none focus:border-blue-500 outline-0"
          ></textarea>
        </div>
        <div className="h-[inherit] flex flex-col">
          <h2 className="basis-[30px]">For PO</h2>
          <textarea
            name="layer2"
            className="basis-full border rounded-md p-2 resize-none focus:border-blue-500 outline-0"
          ></textarea>
        </div>
      </form>
    </div>
  );
};
