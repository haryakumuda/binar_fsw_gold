// Function to fetch data from the backend API
async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/api/financial");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to format the date in dd-mm-yyyy format
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Function to populate data into the HTML
function populateData(data) {
  const contentElement = document.getElementById("content");

  if (!data || !data.success || !data.data) {
    contentElement.innerHTML = "<p>No data available.</p>";
    return;
  }

  const transactions = data.data;

  const transactionCards = transactions.map(
    (transaction) => `
      <div class="transaction-card" data-id="${
        transaction.id
      }"> <!-- Add data-id attribute -->
      <div class="transaction-datetime">${formatDate(
        transaction.datetime
      )}</div>
        <div class="transaction-category">${transaction.category}</div>
        <div class="transaction-info">
          <div class="transaction-detail">${transaction.detail}</div>
          <div class="transaction-payment">${transaction.payment_provider}</div>
        </div>
        <div class="transaction-amount" style="color: ${
          transaction.payment_type === "expense"
            ? "red"
            : transaction.payment_type === "income"
            ? "green"
            : "black"
        }">
          Rp. ${transaction.amount}
        </div>
        <div class="transaction-option">
          <div class="transaction-edit">
            <img src="./assets/edit.png" alt="edit" />
          </div>
          <div class="transaction-delete">
            <img src="./assets/delete.png" alt="delete" />
          </div>
        </div>
      </div>
    `
  );

  contentElement.innerHTML = transactionCards.join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchData();
  populateData(data);

  const updateButtons = document.querySelectorAll(".transaction-edit");
  updateButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const card = event.currentTarget.closest(".transaction-card");
      const transactionId = card.dataset.id; // Verify that this value is not undefined
      console.log("Transaction ID:", transactionId); // Debugging log

      const datetime = document.getElementById("datetime").value;
      const category = document.getElementById("category").value;
      const paymentType = document.getElementById("payment_type").value;
      const amount = document.getElementById("amount").value;
      const paymentProvider = document.getElementById("payment_provider").value;
      const detail = document.getElementById("detail").value;

      // Extract the existing transaction data from the transaction card
      const transactionCard = event.currentTarget.closest(".transaction-card");

      const transactionDatetime = transactionCard.querySelector(
        ".transaction-datetime"
      ).textContent;
      const transactionCategory = transactionCard.querySelector(
        ".transaction-category"
      ).textContent;
      const transactionPaymentType =
        transactionCard.querySelector(".transaction-amount").style.color ===
        "red"
          ? "expense"
          : transactionCard.querySelector(".transaction-amount").style.color ===
            "green"
          ? "income"
          : "unknown"; // You need to handle this better in your actual code
      const transactionAmount = transactionCard
        .querySelector(".transaction-amount")
        .textContent.replace("Rp. ", "");
      const transactionPaymentProvider = transactionCard.querySelector(
        ".transaction-payment"
      ).textContent;
      const transactionDetail = transactionCard.querySelector(
        ".transaction-detail"
      ).textContent;

      // Create the newTransaction object with current data as fallback
      const newTransaction = {
        datetime: datetime || transactionDatetime,
        category: category || transactionCategory,
        payment_type: paymentType || transactionPaymentType,
        amount: amount || transactionAmount,
        payment_provider: paymentProvider || transactionPaymentProvider,
        detail: detail || transactionDetail,
      };
      try {
        const response = await fetch(
          `http://localhost:3000/api/financial?id=${transactionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTransaction),
          }
        );

        if (response.ok) {
          const newData = await response.json();
          console.log("Data Updated:", newData);
          const updatedData = await fetchData();
          populateData(updatedData);
          window.location.reload(); // Reload the page after successful update
        } else {
          console.error("Failed to update data");
        }
      } catch (error) {
        console.error("Error updating data:", error);
      }
    });
  });

  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll(".transaction-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const card = event.currentTarget.closest(".transaction-card");
      const transactionId = card.dataset.id; // Verify that this value is not undefined
      console.log("Transaction ID:", transactionId); // Debugging log

      try {
        const response = await fetch(
          `http://localhost:3000/api/financial?id=${transactionId}`, // Verify that the URL is constructed correctly
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          console.log("Data deleted:", transactionId);
          const updatedData = await fetchData();
          populateData(updatedData);
          window.location.reload(); // Reload the page after successful deletion
        } else {
          console.error("Failed to delete data");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      } finally {
        button.disabled = false; // Re-enable the button
      }
    });
  });
});

// Fetch data and populate the HTML when the page loads
const insertButton = document.getElementById("insert-button");
insertButton.addEventListener("click", async () => {
  const datetime = document.getElementById("datetime").value;
  const category = document.getElementById("category").value;
  const paymentType = document.getElementById("payment_type").value;
  const amount = document.getElementById("amount").value;
  const paymentProvider = document.getElementById("payment_provider").value;
  const detail = document.getElementById("detail").value;

  const newTransaction = {
    datetime,
    category,
    payment_type: paymentType,
    amount,
    payment_provider: paymentProvider,
    detail,
  };

  try {
    const response = await fetch("http://localhost:3000/api/financial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    });

    if (response.ok) {
      const newData = await response.json();
      console.log("Data inserted:", newData);
      const updatedData = await fetchData();
      populateData(updatedData);
    } else {
      console.error("Failed to insert data");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
});
