# 📊 Sanity Backend Table Visualization

## Conference Registrations Table View

This is how the registration data appears in Sanity Studio's table format:

### Main Registration Table
```
┌─────────────────┬─────────────────────┬─────────────────────────┬─────────────────────┬─────────────────┬─────────────────┐
│ Registration ID │ Full Name           │ Email                   │ Registration Type   │ Total Price     │ Payment Status  │
├─────────────────┼─────────────────────┼─────────────────────────┼─────────────────────┼─────────────────┼─────────────────┤
│ REG-LKJ123-ABC  │ Dr John Doe         │ john.doe@test.com       │ Speaker/Poster      │ $449 USD        │ ✅ COMPLETED    │
│                 │                     │                         │ (In-Person)         │                 │ (TEST)          │
├─────────────────┼─────────────────────┼─────────────────────────┼─────────────────────┼─────────────────┼─────────────────┤
│ REG-MNO456-DEF  │ Prof Jane Smith     │ jane.smith@test.com     │ Listener (Virtual)  │ $199 USD        │ ✅ COMPLETED    │
│                 │                     │                         │                     │                 │ (TEST)          │
├─────────────────┼─────────────────────┼─────────────────────────┼─────────────────────┼─────────────────┼─────────────────┤
│ REG-PQR789-GHI  │ Ms Alice Johnson    │ alice.johnson@test.com  │ Student (In-Person) │ $149 USD        │ ✅ COMPLETED    │
│                 │                     │                         │                     │                 │ (TEST)          │
└─────────────────┴─────────────────────┴─────────────────────────┴─────────────────────┴─────────────────┴─────────────────┘
```

### Extended Registration Details
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Registration ID │ Country         │ Phone Number    │ Participants    │ Accommodation   │ Registration    │
│                 │                 │                 │                 │                 │ Date            │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ REG-LKJ123-ABC  │ United States   │ +1234567890     │ 1               │ Hotel A - 2N    │ 2024-01-15      │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ REG-MNO456-DEF  │ Canada          │ +1987654321     │ 1               │ None            │ 2024-01-15      │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ REG-PQR789-GHI  │ United Kingdom  │ +4412345678     │ 1               │ Hotel B - 3N    │ 2024-01-15      │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

## Payment Records Table View

This is how the payment data appears in Sanity Studio:

### Main Payment Table
```
┌─────────────────┬─────────────────────┬─────────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Payment ID      │ Customer Name       │ Registration ID     │ Amount          │ Payment Method  │ Status          │
├─────────────────┼─────────────────────┼─────────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ TEST_PAY_170312 │ Dr John Doe         │ REG-LKJ123-ABC      │ $449 USD        │ 🧪 test_payment │ ✅ COMPLETED    │
│ 3456789         │                     │                     │                 │                 │ (TEST)          │
├─────────────────┼─────────────────────┼─────────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ TEST_PAY_170312 │ Prof Jane Smith     │ REG-MNO456-DEF      │ $199 USD        │ 🧪 test_payment │ ✅ COMPLETED    │
│ 3456790         │                     │                     │                 │                 │ (TEST)          │
├─────────────────┼─────────────────────┼─────────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ TEST_PAY_170312 │ Ms Alice Johnson    │ REG-PQR789-GHI      │ $149 USD        │ 🧪 test_payment │ ✅ COMPLETED    │
│ 3456791         │                     │                     │                 │                 │ (TEST)          │
└─────────────────┴─────────────────────┴─────────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Extended Payment Details
```
┌─────────────────┬─────────────────────┬─────────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Payment ID      │ Order ID            │ Customer Email      │ Payment Date    │ Currency        │ Test Payment    │
├─────────────────┼─────────────────────┼─────────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ TEST_PAY_170312 │ TEST_ORDER_17031234 │ john.doe@test.com   │ 2024-01-15      │ USD             │ ✅ Yes          │
│ 3456789         │ 56789               │                     │ 10:30:15        │                 │                 │
├─────────────────┼─────────────────────┼─────────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ TEST_PAY_170312 │ TEST_ORDER_17031234 │ jane.smith@test.com │ 2024-01-15      │ USD             │ ✅ Yes          │
│ 3456790         │ 56790               │                     │ 10:31:22        │                 │                 │
├─────────────────┼─────────────────────┼─────────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ TEST_PAY_170312 │ TEST_ORDER_17031234 │ alice.j@test.com    │ 2024-01-15      │ USD             │ ✅ Yes          │
│ 3456791         │ 56791               │                     │ 10:32:45        │                 │                 │
└─────────────────┴─────────────────────┴─────────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

## Sanity Studio Interface Features

### 1. **Document List View**
- Each registration appears as a card with preview information
- Shows customer name, email, payment status, and total amount
- Color-coded status indicators (green for completed, orange for test)
- Sortable by registration date, payment status, customer name

### 2. **Table Plugin View**
- Spreadsheet-like interface for bulk data management
- Filterable columns for easy data analysis
- Export capabilities for reporting
- Bulk edit operations for administrative tasks

### 3. **Individual Document View**
When clicking on a specific registration, you see:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          REGISTRATION DETAILS                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Registration ID: REG-LKJ123-ABC                                                │
│ Registration Type: Regular Registration                                        │
│ Status: ✅ Active                                                              │
│                                                                                 │
│ PERSONAL DETAILS                                                               │
│ ├─ Full Name: Dr John Doe                                                      │
│ ├─ Email: john.doe@test.com                                                    │
│ ├─ Phone: +1234567890                                                          │
│ ├─ Country: United States                                                      │
│ └─ Address: 123 Test Street, Test City, Test State, 12345                     │
│                                                                                 │
│ REGISTRATION DETAILS                                                           │
│ ├─ Selected Type: Speaker/Poster (In-Person)                                  │
│ ├─ Abstract Category: Poster                                                   │
│ ├─ Participants: 1                                                             │
│ └─ Registration Date: 2024-01-15T10:30:00.123Z                               │
│                                                                                 │
│ ACCOMMODATION                                                                  │
│ ├─ Hotel: Hotel A                                                              │
│ ├─ Room Type: Single Occupancy                                                 │
│ └─ Nights: 2                                                                   │
│                                                                                 │
│ PRICING BREAKDOWN                                                              │
│ ├─ Registration Fee: $299 USD                                                  │
│ ├─ Accommodation Fee: $150 USD                                                 │
│ ├─ Total Price: $449 USD                                                       │
│ └─ Pricing Period: Early Bird                                                  │
│                                                                                 │
│ PAYMENT INFORMATION                                                            │
│ ├─ Payment Status: ✅ COMPLETED (TEST)                                         │
│ ├─ Payment ID: TEST_PAY_1703123456789                                          │
│ ├─ Order ID: TEST_ORDER_1703123456789                                          │
│ ├─ Payment Method: 🧪 test_payment                                             │
│ ├─ Payment Date: 2024-01-15T10:30:15.123Z                                     │
│ └─ Test Payment: ✅ Yes                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4. **Payment Record Detail View**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PAYMENT RECORD                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Payment ID: TEST_PAY_1703123456789                                              │
│ Status: ✅ COMPLETED (TEST)                                                     │
│                                                                                 │
│ TRANSACTION DETAILS                                                            │
│ ├─ Order ID: TEST_ORDER_1703123456789                                          │
│ ├─ Amount: $449 USD                                                             │
│ ├─ Currency: USD                                                                │
│ ├─ Payment Method: 🧪 test_payment                                             │
│ └─ Payment Date: 2024-01-15T10:30:15.123Z                                     │
│                                                                                 │
│ CUSTOMER INFORMATION                                                           │
│ ├─ Name: Dr John Doe                                                           │
│ ├─ Email: john.doe@test.com                                                    │
│ └─ Registration ID: REG-LKJ123-ABC                                             │
│                                                                                 │
│ SYSTEM INFORMATION                                                             │
│ ├─ Test Payment: ✅ Yes                                                        │
│ ├─ Created: 2024-01-15T10:30:15.123Z                                          │
│ ├─ Updated: 2024-01-15T10:30:15.123Z                                          │
│ └─ Reference: → Conference Registration Document                                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key Visual Indicators

### Status Icons
- ✅ **Completed**: Green checkmark for successful payments
- ⏳ **Pending**: Clock icon for pending payments
- ❌ **Failed**: Red X for failed payments
- 🔄 **Refunded**: Circular arrow for refunded payments

### Test Payment Indicators
- 🧪 **Test Payment Icon**: Appears next to test payments
- **(TEST)** **Label**: Added to status displays
- **Orange Theme**: Used in success pages for test payments
- **Special Formatting**: Test payments clearly distinguished

### Data Relationships
- **Linked Records**: Payment records link to registration records
- **Reference Navigation**: Click to navigate between related documents
- **Consistent IDs**: Registration ID appears in both tables for easy correlation

This comprehensive table structure provides administrators with complete visibility into all registration and payment data, with clear indicators for test vs. production transactions.
