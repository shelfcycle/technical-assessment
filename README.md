# ShelfCycle Assessment

We're excited to see how you approach building solutions using React, tRPC, and PostgreSQL — the core technologies
we use to deliver features and value to our users. While we would love for you to use our stack here if you feel more
comfortable in another stack then feel free to use that instead!

In this assessment, we're evaluating your ability to:

- Frontend Development: Build clean and intuitive user interfaces using React.
- API Design: Leverage tRPC to create and consume type-safe APIs.
- Database Interaction: Use PostgreSQL efficiently to store and retrieve data.
- Problem-Solving: Break down challenges into clear, logical solutions.
- Code Quality: Write maintainable, readable, and performant code.

If you have time and feel confident, feel free to add extra features, optimizations or other quality gateways.
They're not required but can demonstrate your creativity.

## Objectives

This assessment has a few core objectives:

- **Display Customers records**
  - 📝 NOTE - if using this repo, then this part is already done for you!
- **Edit existing Customer records**
  - Implement the functionality to update details for an existing Customer.

* **Create a new `Product` model with the following columns**
  - id
  - name
  - unit of measure (lb, gal, kg, etc)
  - customer (each Product should belong to a Customer)

- **Create Product record for a Customer**
  - Enable the creation of Product records associated with a specific Customer.
  - Each Product should include details such as its name, unit of measurement, and any association to a Customer.
  - Each Product should be unique for each Customer. A Customer should not be able to create multiple "_Copper_" Products, for example.
- **Display related Product records on the Customer Detail Page**
  - Update the detail page for Customer where all associated Product records are listed.
  - Ensure the data is clearly presented and easy to interact with.
- **Delete Product from a Customer**
  - Provide the ability to delete a Product associated with a Customer.

### Submitting

Once you have completed the assessment and feel good about it, feel free to open a PR against this
[repository](https://github.com/shelfcycle/technical-assessment) or send us a link to your own public repo.

## Getting Started

If using this repo as a starter then everything you need to get started can be kicked off with the Docker Compose config. Simply run:

```bash
docker-compose up
```

Once it's up and running you can access the client at [`http://localhost:3000`](http://localhost:3000).

If you need to access the Postgres database instance directly, you can use the following connection string:

```
postgresql://postgres:password@localhost:5432/mydb
```

> 📝 **NOTE** - If you would rather use Next locally instead of through Docker you can use the above connection string in place of the existing `DATABASE_URL` env var.

### Included libs

- [Next](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [Taiwind](https://tailwindcss.com/)

Any existing components or functionality is free to reuse, and there are no limits to how you solve
problems or what you change.
