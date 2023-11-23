interface UseTestProps<T> {
  item: T;
}

const useTest = <
  T extends {
    name: string;
  }
>({
  item,
}: UseTestProps<T>) => {
  return <div>{item.name}</div>;
};

export default useTest;
