import { PageTitle } from "@/components/PageTitle";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const CustomerDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const sanitizedId = Number(id);
  const customerQuery = trpc.customers.getById.useQuery({ id: sanitizedId });

  if (!!customerQuery.data) {
    const { item } = customerQuery.data;
    return (
      <div>
        <PageTitle>Customer: {item.name}</PageTitle>
        <div>
          <ul>
            <li>
              Phone: <a href={`tel:${item.phone}`}>{item.phone}</a>
            </li>
            <li>
              Email: <a href={`mailto:${item.email}`}>{item.email}</a>
            </li>
          </ul>
        </div>
        <div>
          <p>Address</p>
          <p>
            {item.street1}
            <br />
            {item.city}, {item.state} {item.zipCode}
          </p>
        </div>
      </div>
    );
  }
};

export default CustomerDetailPage;
