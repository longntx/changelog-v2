import { useSelect } from 'downshift';
import classNames from 'classnames';

type TItem = {
  id: number | string;
  value: string;
};

export type TSelect = {
  items: TItem[];
  label?: string;
};

const Select = ({ items, label }: TSelect) => {
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
  });

  function itemToString(item: TItem | null) {
    return item ? item.value : '';
  }

  return (
    <div className="w-[inherit] relative">
      <div className="flex flex-col gap-1">
        <label {...getLabelProps()}>{label || 'Select'}</label>
        <div
          className="p-2 bg-white flex justify-between cursor-pointer focus:border-blue-500 outline-0 border rounded-md"
          {...getToggleButtonProps()}
        >
          <span>{selectedItem ? selectedItem.value : 'Elements'}</span>
          <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
        </div>
      </div>
      <ul
        className={`absolute w-[inherit] overflow-x-hidden bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 ${
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
                'py-2 px-3 shadow-sm flex flex-col',
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
