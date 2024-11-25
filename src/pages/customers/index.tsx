import Link from "next/link";
import { PageTitle } from "@/components/PageTitle";
import { trpc } from "@/utils/trpc";
import { Table } from "@/components/Table";

const CustomersPage = () => {
  const customersQuery = trpc.customers.list.useQuery();

  const items = customersQuery.data?.items || [];
  return (
    <div>
      <PageTitle>Customers</PageTitle>
      <Table
        items={items}
        rowConfig={[
          {
            field: "id",
            title: "ID",
          },
          {
            field: "name",
            title: "Name",
          },
          {
            field: "",
            title: "",
            render: (item) => (
              <Link href={`/customers/${item.id}`}>View More</Link>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CustomersPage;
