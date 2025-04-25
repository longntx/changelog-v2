import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {parseDailyReport, regConvert} from '@/utils';
import Select, {TItem} from '@/components/common/select';

type FormValues = {
  prefix: string;
  url: string;
  raw: string;
  result: string;
  type: TItem;
};

const items = [
  {id: 1, value: 'Daily report'},
  {
    id: 2,
    value: 'Dev Release Note',
  },
  {
    id: 3,
    value: 'PO Release Note',
  },
];

export default function Convert() {
  const {register, handleSubmit, setValue, control, watch} =
    useForm<FormValues>();

  const handleOnClick: SubmitHandler<FormValues> = (data) => {
    if (data.type.id === 1) {
      const res = parseDailyReport(data.raw);
      setValue('result', res || '');
      return;
    }
    console.log('in', data.type.id);
    const res = regConvert({
      sourceString: data.raw,
      bitBucketRepoLink: data.url,
      projectPrefix: data.prefix,
      type: Number(data.type.id),
    });
    setValue('result', res || '');
  };

  return (
    <form
      name="basic"
      className="flex flex-col"
      onSubmit={handleSubmit(handleOnClick)}
    >
      <div className="grid gap-4 md:grid-cols-[350px_minmax(900px,_1fr)]">
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-1">
            <label htmlFor="projectPrefix">Project Prefix</label>
            <input
              id="projectPrefix"
              className="mt-3 w-[inherit] resize-none rounded-md border p-2 text-gray-700 outline-0 placeholder:accent-gray-600 focus:border-blue-500"
              placeholder="Project Prefix. EG: FTD"
              {...register('prefix', {required: watch('type') && watch('type')?.id !== 1})}
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <label htmlFor="projectPrefix">Repo Pull Requests URL</label>
            <textarea
              id="projectPrefix"
              rows={4}
              className="mt-3 w-[inherit] resize-none rounded-md border p-2 text-gray-700 outline-0 placeholder:accent-gray-600 focus:border-blue-500"
              placeholder="Repo Pull Requests URL. Eg: https://bitbucket.org/est-rouge/ftd-admin-console/pull-requests/"
              {...register('url', {required: watch('type') && watch('type')?.id !== 1})}
            />
          </div>
          <div className="flex w-full flex-row">
            <Controller
              control={control}
              name="type"
              rules={{required: true}}
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <Select
                  items={items}
                  onChange={onChange}
                  defaultValue={items[0]}
                  label={'Select type'}
                  placeholder="Type"
                />
              )}
            />
          </div>
          <button
            type="button"
            className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            role="button"
            onClick={handleSubmit(handleOnClick)}
          >
            Convert
          </button>
        </div>
        <div className="grid h-[calc(100dvh-60px)] grid-rows-2 gap-4">
          <div className="flex flex-col">
            <textarea
              placeholder="Raw"
              className="basis-full resize-none rounded-md border p-2 outline-0 focus:border-blue-500"
              {...register('raw', {required: true})}
            />
          </div>

          <div className="flex flex-col">
            <textarea
              placeholder="Result"
              className="basis-full resize-none rounded-md border p-2 outline-0 focus:border-blue-500"
              {...register('result')}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
