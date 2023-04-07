import { useSelect } from 'downshift';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useEffectOnce } from 'usehooks-ts';

export type TItem = {
  id: number | string;
  value: string;
};

export type TSelect = {
  items: TItem[];
  label?: string;
  placeholder?: string;
  onChange?: (...event: any[]) => void;
  defaultValue?: TItem;
};

const Select = ({
  items,
  label,
  placeholder,
  onChange,
  defaultValue,
}: TSelect) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: items,
    itemToString,
    onSelectedItemChange: (inputValue) => onChange?.(inputValue.selectedItem),
    defaultSelectedItem: defaultValue,
  });

  useEffectOnce(() => {
    if (defaultValue && onChange) {
      onChange(defaultValue);
    }
  });

  function itemToString(item: TItem | null) {
    return item ? item.value : '';
  }

  return (
    <div className="relative w-[inherit]">
      <div className="flex flex-col gap-1">
        <label {...getLabelProps()}>{label || 'Select'}</label>
        <div
          className="mt-3 flex cursor-pointer justify-between rounded-md border bg-white p-2 outline-0 focus:border-blue-500"
          {...getToggleButtonProps()}
        >
          <span>
            {selectedItem ? selectedItem.value : placeholder || 'Type'}
          </span>
          <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
        </div>
      </div>
      <ul
        className={`absolute mt-1 max-h-80 w-[inherit] overflow-y-auto overflow-x-hidden bg-white p-0 shadow-md ${
          !isOpen && 'hidden'
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={classNames(
                highlightedIndex === index && 'bg-blue-300',
                selectedItem === item && 'font-bold',
                'flex flex-col px-3 py-2 shadow-sm',
              )}
              key={`${item.id}${index}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.value}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Select;
