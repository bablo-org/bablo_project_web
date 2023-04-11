import { useQuery } from "@tanstack/react-query";

const useGetCurrencies = () => {
  return useQuery({
    queryKey: ["currencies"],
    placeholderData: [],
    select: (data) =>
      data.map((currency) => ({
        id: currency.id,
        name: currency.name,
        rate: currency.rate,
        updated: currency.updated,
      })),
  });
};

export { useGetCurrencies };
