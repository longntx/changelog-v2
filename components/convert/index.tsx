import { SubmitHandler, useForm } from 'react-hook-form';
import { regConvert } from '@/utils';
import Select from '@/components/common/select';

type FormValues = {
  prefix: string;
  url: string;
  raw: string;
  result: string;
};

const items = [
  {
    id: 1,
    value: 'Dev Release Note',
  },
  {
    id: 2,
    value: 'PO Release Note',
  },
];

export default function Convert() {
  const { register, handleSubmit, setValue } = useForm<FormValues>();

  const handleOnClick: SubmitHandler<FormValues> = (data) => {
    const res = regConvert({
      sourceString: data.raw,
      bitBucketRepoLink: data.url,
      projectPrefix: data.prefix,
    });
    setValue('result', res || '');
  };

  return (
    <form
      name="basic"
      className="flex flex-col"
      onSubmit={handleSubmit(handleOnClick)}
    >
      <div className="grid md:grid-cols-[250px_minmax(900px,_1fr)] gap-4">
        <div className="flex flex-col gap-4">
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="projectPrefix">Project Prefix</label>
            <input
              id="projectPrefix"
              className="mt-3 border w-[inherit] rounded-md p-2 resize-none focus:border-blue-500 outline-0 placeholder:accent-gray-600 text-gray-700"
              placeholder="Project Prefix. EG: FTD"
              {...register('prefix', { required: true })}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="projectPrefix">Repo Pull Requests URL</label>
            <textarea
              id="projectPrefix"
              rows={4}
              className="mt-3 border w-[inherit] rounded-md p-2 resize-none focus:border-blue-500 outline-0 placeholder:accent-gray-600 text-gray-700"
              placeholder="Repo Pull Requests URL. Eg: https://bitbucket.org/est-rouge/ftd-admin-console/pull-requests/"
              {...register('url', { required: true })}
            />
          </div>
          <div className="w-full flex flex-row">
            <Select items={items} label={'T'} />
            {/*<button*/}
            {/*  type="button"*/}
            {/*  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"*/}
            {/*  role="button"*/}
            {/*  onClick={handleSubmit(handleOnClick)}*/}
            {/*>*/}
            {/*  Convert*/}
            {/*</button>*/}
          </div>
        </div>
        <div className="h-[calc(100dvh-60px)] grid grid-rows-2 gap-4">
          <div className="flex flex-col">
            <textarea
              placeholder="Raw"
              className="basis-full border rounded-md p-2 resize-none focus:border-blue-500 outline-0"
              {...register('raw', { required: true })}
            />
          </div>

          <div className="flex flex-col">
            <textarea
              placeholder="Result"
              className="basis-full border rounded-md p-2 resize-none focus:border-blue-500 outline-0"
              {...register('result')}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
