import { useQuery } from "@tanstack/react-query";

const useGetCurrencues = () => {
  return useQuery({
    queryKey: ["currencies"],
    initialData: [],
    select: (data) =>
      data.map((currency) => ({
        id: currency.id,
        name: currency.name,
        rate: currency.rate,
        updated: currency.updated,
      })),
  });
};

export { useGetCurrencues };
