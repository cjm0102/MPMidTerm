$(document).ready(function() {
    // Initialize expenses array and check local storage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    if (expenses.length === 0) {
        console.log("Empty expenses array");
    } else {
        console.log("Loaded expenses:", expenses);
    }

    // Expose expenses to other scripts
    window.expenses = expenses;

    // Save to local storage function
    window.saveExpenses = function() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    };

    // Add expense functionality
    $('#add-expense-form').on('submit', function(e) {
        e.preventDefault();

        let amount = parseFloat($('#amount').val()).toFixed(2);
        let date = $('#date').val();
        let category = $('#category').val();
        let description = $('#description').val();

        let newExpense = { amount, date, category, description };

        expenses.push(newExpense);
        saveExpenses();

        alert('Expense added successfully!');
        this.reset();

        // Redirect to index.html
        window.location.href = 'index.html';
    });

    // Render all expenses
    const renderExpenses = () => {
        let groupedExpenses = {};

        // Group expenses by date
        expenses.forEach((expense, index) => {
            if (!groupedExpenses[expense.date]) {
                groupedExpenses[expense.date] = [];
            }
            groupedExpenses[expense.date].push({ ...expense, index });
        });

        let $expenseRecords = $('#expense-records');
        $expenseRecords.empty();

        // Sort dates in descending order
        let sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));

        sortedDates.forEach(date => {
            let dailyTotal = groupedExpenses[date].reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

            let $dateSection = $(`
                <div class="card mt-3">
                    <div class="card-header d-flex justify-content-between">
                        <span>${date}</span>
                        <span>Total: RM${dailyTotal.toFixed(2)}</span>
                    </div>
                    <ul class="list-group list-group-flush"></ul>
                </div>
            `);

            groupedExpenses[date].forEach(expense => {
                let iconClass = getIconClass(expense.category);
                let actionButtons = window.location.pathname.includes('delete.html')
                    ? `<button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.index})">Delete</button>`
                    : window.location.pathname.includes('edit.html')
                    ? `<button class="btn btn-primary btn-sm" onclick="showEditForm(${expense.index})">Edit</button>`
                    : '';

                $dateSection.find('.list-group').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <i class="${iconClass}"></i>
                            ${expense.description}
                        </div>
                        <div>
                            <span>RM${parseFloat(expense.amount).toFixed(2)}</span>
                            ${actionButtons}
                        </div>
                    </li>
                `);
            });

            $expenseRecords.append($dateSection);
        });
    };

    const getIconClass = (category) => {
        switch(category.toLowerCase()) {
            case 'entertainment':
                return 'fas fa-film';
            case 'food':
                return 'fas fa-utensils';
            case 'transport':
                return 'fas fa-plane';
            case 'shopping':
                return 'fas fa-shopping-cart';
            case 'health':
                return 'fas fa-heartbeat';
            case 'other':
            default:
                return 'fas fa-tags';
        }
    };

    // Delete expense functionality
    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        saveExpenses();
        renderExpenses();
    };

    // Show edit form and populate fields
    window.showEditForm = function(index) {
        let expense = expenses[index];
        $('#edit-amount').val(parseFloat(expense.amount).toFixed(2));
        $('#edit-date').val(expense.date);
        $('#edit-category').val(expense.category);
        $('#edit-description').val(expense.description);
        $('#edit-expense-form').data('index', index).removeClass('d-none');
        $('html, body').animate({ scrollTop: $('#edit-expense-form').offset().top }, 1000);
    };

    // Edit expense functionality
    $('#edit-expense-form').on('submit', function(e) {
        e.preventDefault();
        let index = $(this).data('index');
        let amount = parseFloat($('#edit-amount').val()).toFixed(2);
        let date = $('#edit-date').val();
        let category = $('#edit-category').val();
        let description = $('#edit-description').val();

        if (amount && date && category && description) {
            expenses[index] = { amount, date, category, description };
            saveExpenses();
            alert('Expense updated successfully!');
            $('#edit-expense-form').addClass('d-none');
            renderExpenses();
        } else {
            alert('All fields are required.');
        }
    });

    // Run functions based on the current page
    if (window.location.pathname.includes('index.html') || window.location.pathname.includes('delete.html') || window.location.pathname.includes('edit.html')) {
        renderExpenses();
    }
});
