export const WelcomeMessage = () => (
  <div>
    <p>
      We're excited to see how you approach building solutions using React,
      tRPC, and PostgreSQL — the core technologies we use to deliver features
      and value to our users.
    </p>

    <p>In this assessment, we're evaluating your ability to:</p>

    <ul>
      <li>
        Frontend Development: Build clean and intuitive user interfaces using
        React.
      </li>
      <li>API Design: Leverage tRPC to create and consume type-safe APIs.</li>
      <li>
        Database Interaction: Use PostgreSQL efficiently to store and retrieve
        data.
      </li>
      <li>
        Problem-Solving: Break down challenges into clear, logical solutions.
      </li>
      <li>Code Quality: Write maintainable, readable, and performant code.</li>
    </ul>

    <p>
      If you have time and feel confident, feel free to add extra features or
      optimizations. They're not required but can demonstrate your creativity.
    </p>

    <h3>Included libs</h3>

    <ul>
      <li>
        <a target="_blank" href="https://nextjs.org/">
          Next
        </a>
      </li>
      <li>
        <a target="_blank" href="www.prisma.io/">
          Prisma
        </a>
      </li>
      <li>
        <a target="_blank" href="https://trpc.io/">
          tRPC
        </a>
      </li>
      <li>
        <a target="_blank" href="https://tailwindcss.com/">
          Taiwind
        </a>
      </li>
    </ul>

    <hr />

    <h3 className="text-xl font-bold mt-4 mb-2">Objectives</h3>

    <p>This assessment has a few core objectives:</p>

    <ul>
      <li>
        Edit Existing Customers:
        <ul>
          <li>
            Implement the functionality to update details for an existing
            Customer.
          </li>
        </ul>
      </li>
      <li>
        Create a new <code>Product</code> model with the following columns:
        <ul>
          <li>id</li>
          <li>name</li>
          <li>unit of measure (lb, gal, kg, etc)</li>
          <li>customer (each Product should belong to a Customer)</li>
        </ul>
      </li>
      <li>
        Create Products for a Customer:
        <ul>
          <li>
            Enable the creation of Product records associated with a specific
            Customer.
          </li>
          <li>
            Each Product should include details such as its name, unit of
            measurement, and any association to a Customer.
          </li>
          <li>
            Each Product should be unique for each Customer. A Customer should
            not be able to create multiple "<em>Copper</em>" Products, for
            example.
          </li>
        </ul>
      </li>
      <li>
        Display Products on the Customer Detail Page:
        <ul>
          <li>
            Update the detail page for Customer where all associated Product
            records are listed.
          </li>
          <li>
            Ensure the data is clearly presented and easy to interact with.
          </li>
        </ul>
      </li>
      <li>
        Delete Products from a Customer:
        <ul>
          <li>
            Provide the ability to delete a Product associated with a Customer.
          </li>
        </ul>
      </li>
    </ul>

    <p>
      Any existing components or functionality is free to reuse, and there are
      no limits to how you solve problems or what you change.
    </p>
  </div>
);
