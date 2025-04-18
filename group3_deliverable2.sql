create database MALL_MANAGEMENT_SYSTEM1;
Go

use MALL_MANAGEMENT_SYSTEM1;
Go

-- Creating Tables
CREATE TABLE Personnel(
username VARCHAR(100) NOT NULL primary key,
role varchar(15) check(role in ('store_owner','admin','subscriber')) not null,
fname VARCHAR(100) NOT NULL,
lname VARCHAR(100) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL
);

ALTER TABLE Personnel add refreshToken varchar(200);

CREATE TABLE Shop(
shop_no INT PRIMARY KEY,
location VARCHAR(255) NOT NULL,
status varchar(10) check (status in('occupied','vacant')) DEFAULT 'vacant'
);

ALTER TABLE Shop add shopowner varchar(100)
ALTER TABLE Shop add constraint fk_shopowner foreign key(shopowner) references Personnel(username);

CREATE TABLE STORE(
store_id INT PRIMARY KEY identity(1,1),
store_name VARCHAR(255) NOT NULL,
shop_no INT UNIQUE NOT NULL,
store_owner_username varchar(100),
category VARCHAR(100),
status  varchar(10) check( status in ('active', 'inactive')) default 'inactive',
FOREIGN KEY (store_owner_username) REFERENCES Personnel(username) ON DELETE SET NULL
);

ALTER TABLE STORE add constraint fk_shop_no foreign key(shop_no) references Shop(shop_no);


CREATE TABLE Rent (
    shop_no INT PRIMARY KEY,
    rent_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (shop_no) REFERENCES Shop(shop_no) ON DELETE CASCADE
);

CREATE TABLE TRANSACTIONS (
    transaction_id INT PRIMARY KEY identity(1,1),
    amount DECIMAL(10,2) NOT NULL,
    method varchar(20) check (method in ('cash', 'credit_card', 'bank_transfer', 'UPI')) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    type varchar(20) check (type in ('rent', 'bill', 'miscellaneous')) NOT NULL,
    username varchar(100),  -- username of subscriber or store owner
    FOREIGN KEY (username) REFERENCES Personnel(username) ON DELETE SET NULL
);

CREATE TABLE MONTHLY_RENT_PAYMENT (
    payment_id INT PRIMARY KEY IDENTITY(1,1),
    shop_no INT,
    month_year DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('paid', 'pending')) DEFAULT 'pending',
    transaction_id INT,
    FOREIGN KEY (shop_no) REFERENCES Shop(shop_no) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES TRANSACTIONS(transaction_id) ON DELETE SET NULL
);

CREATE TABLE UTILITY_BILL (
    bill_id INT PRIMARY KEY IDENTITY(1,1),
    shop_no INT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('electricity', 'water', 'gas', 'internet')),
    amount DECIMAL(10,2) NOT NULL,
    transaction_id INT,
    status VARCHAR(20) CHECK (status IN ('pending', 'paid')) DEFAULT 'pending',
    month_year DATE NOT NULL,
    FOREIGN KEY (shop_no) REFERENCES Shop(shop_no) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES TRANSACTIONS(transaction_id) ON DELETE SET NULL
);

CREATE TABLE DAILY_STORE_REVENUE (
    revenue_id INT PRIMARY KEY IDENTITY(1,1),
    store_id INT,
    total_earnings DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (store_id) REFERENCES STORE(store_id) ON DELETE CASCADE
);

CREATE TABLE EMPLOYEE (
    ssn INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(12),
    role_id INT NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    subscriber VARCHAR(100),
    FOREIGN KEY (subscriber) REFERENCES Personnel(username) ON DELETE SET NULL
);

CREATE TABLE PAYROLL (
    payroll_id INT PRIMARY KEY IDENTITY(1,1),
    ssn INT,
    month_year DATE NOT NULL,
    salary_paid DECIMAL(10,2) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('pending', 'paid')) DEFAULT 'pending',
    transaction_id INT,
    FOREIGN KEY (ssn) REFERENCES EMPLOYEE(ssn) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES TRANSACTIONS(transaction_id) ON DELETE SET NULL
);

CREATE TABLE ATTENDANCE (
    attendance_id INT PRIMARY KEY IDENTITY(1,1),
    ssn INT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(12) CHECK (status IN ('present', 'absent', 'leave')) NOT NULL,
    FOREIGN KEY (ssn) REFERENCES EMPLOYEE(ssn) ON DELETE CASCADE
);

CREATE TABLE SUBSCRIPTION (
    subscription_id INT PRIMARY KEY IDENTITY(1,1),
    mallowner_username VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(12) CHECK (status IN ('active', 'expired')) DEFAULT 'active',
    amount DECIMAL(10,2) NOT NULL,
    transaction_id INT,
    FOREIGN KEY (mallowner_username) REFERENCES Personnel(username) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES TRANSACTIONS(transaction_id) ON DELETE SET NULL
);

CREATE TABLE Feedback (
    feedback_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(100) NOT NULL,
    message TEXT,
    rating DECIMAL(2,1) NOT NULL,
    FOREIGN KEY (username) REFERENCES Personnel(username)
);

--Additional Altering

ALTER TABLE Personnel add subadmin varchar(100);

--Handle deleting of all it's related user when a subadmin account delete and also handle it in subscription expiry
ALTER TABLE Personnel add constraint fk_personnel foreign key(subadmin) references Personnel(username) on update NO ACTION on delete NO ACTION;

-- Inserting Data
INSERT INTO Shop (shop_no, location, status) VALUES
(101, 'Ground Floor - Near Entrance', 'occupied'),
(102, '1st Floor - Opposite Food Court', 'occupied'),
(103, '2nd Floor - Near Cinema', 'vacant'),
(104, 'Basement - Next to Parking', 'occupied'),
(105, '3rd Floor - Near Play Area', 'vacant');

INSERT INTO Personnel (username, role, fname, lname, email, password) VALUES
('admin1', 'admin', 'Ali', 'Khan', 'admin1@mall.com', 'SecurePass123'),
('storeowner1', 'store_owner', 'Ahmed', 'Raza', 'ahmed.raza@mall.com', 'AhmedPass456'),
('storeowner2', 'store_owner', 'Hassan', 'Sheikh', 'hassan.sheikh@mall.com', 'HassanPass789'),
('subscriber1', 'subscriber', 'Saad', 'Malik', 'saad.malik@mall.com', 'SaadSubPass'),
('subscriber2', 'subscriber', 'Bilal', 'Hameed', 'bilal.hameed@mall.com', 'BilalSubPass');

INSERT INTO STORE (store_name, shop_no, store_owner_username, category, status) VALUES
('Outfitters', 101, 'storeowner1', 'Clothing', 'active'),
('Nike Store', 102, 'storeowner2', 'Footwear', 'active'),
('Coffee House', 103, 'storeowner1', 'Food & Beverage', 'inactive'),
('Tech World', 104, 'storeowner2', 'Electronics', 'active'),
('Book Haven', 105, 'storeowner1', 'Books', 'inactive');

INSERT INTO Rent (shop_no, rent_amount) VALUES
(101, 50000),
(102, 60000),
(103, 45000),
(104, 70000),
(105, 55000);

INSERT INTO TRANSACTIONS (amount, method, payment_date, type, username) VALUES
(50000, 'cash', '2025-01-10', 'rent', 'storeowner1'),
(60000, 'bank_transfer', '2025-01-15', 'rent', 'storeowner2'),
(2000, 'credit_card', '2025-01-20', 'bill', 'storeowner1'),
(45000, 'UPI', '2025-02-05', 'rent', 'storeowner2'),
(1500, 'cash', '2025-02-08', 'miscellaneous', 'subscriber1');

INSERT INTO MONTHLY_RENT_PAYMENT (shop_no, month_year, status, transaction_id) VALUES
(101, '2025-01-01', 'paid', 1),
(102, '2025-01-01', 'paid', 2),
(103, '2025-01-01', 'pending', NULL),
(104, '2025-02-01', 'paid', 4),
(105, '2025-02-01', 'pending', NULL);

INSERT INTO UTILITY_BILL (shop_no, type, amount, transaction_id, status, month_year) VALUES
(101, 'electricity', 5000, 3, 'paid', '2025-01-01'),
(102, 'water', 2000, NULL, 'pending', '2025-01-01'),
(103, 'gas', 1500, NULL, 'pending', '2025-01-01'),
(104, 'internet', 3000, 5, 'paid', '2025-02-02');

INSERT INTO DAILY_STORE_REVENUE (store_id, total_earnings, date) VALUES
(1, 250000, '2025-01-10'),
(2, 350000, '2025-01-15'),
(3, 100000, '2025-01-20'),
(4, 400000, '2025-02-05'),
(5, 150000, '2025-02-08');

INSERT INTO EMPLOYEE (ssn, name, email, phone_number, role_id, salary, subscriber) VALUES
(1001, 'Ali Ahmed', 'ali.ahmed@mall.com', '03001234567', 1, 30000, 'storeowner1'),
(1002, 'Sarah Khan', 'sarah.khan@mall.com', '03007654321', 2, 40000, 'storeowner2'),
(1003, 'Hamza Rafiq', 'hamza.rafiq@mall.com', '03123456789', 3, 35000, 'storeowner1'),
(1004, 'Ayesha Malik', 'ayesha.malik@mall.com', '03451234567', 4, 50000, 'storeowner2'),
(1005, 'Usman Tariq', 'usman.tariq@mall.com', '03219876543', 5, 25000, 'storeowner1');

INSERT INTO PAYROLL (ssn, month_year, salary_paid, status, transaction_id) VALUES
(1001, '2025-01-01', 30000, 'paid', 1),
(1002, '2025-01-01', 40000, 'paid', 2),
(1003, '2025-01-01', 35000, 'pending', NULL),
(1004, '2025-02-01', 50000, 'paid', 4),
(1005, '2025-02-01', 25000, 'pending', NULL);

INSERT INTO ATTENDANCE (ssn, date, status) VALUES
(1001, '2025-02-10', 'present'),
(1002, '2025-02-10', 'absent'),
(1003, '2025-02-10', 'leave'),
(1004, '2025-02-10', 'present'),
(1005, '2025-02-10', 'present');

INSERT INTO SUBSCRIPTION (mallowner_username, start_date, end_date, status, amount, transaction_id) VALUES
('subscriber1', '2025-01-01', '2026-01-01', 'active', 120000, 1),
('subscriber2', '2025-01-15', '2026-01-15', 'active', 150000, 2),
('subscriber1', '2025-02-01', '2026-02-01', 'expired', 100000, NULL),
('subscriber2', '2025-02-10', '2026-02-10', 'active', 130000, 4),
('subscriber1', '2025-02-15', '2026-02-15', 'active', 110000, NULL);

INSERT INTO Feedback (username, message, rating) VALUES
('storeowner1', 'Great mall facilities, but parking needs improvement.', 3.5),
('storeowner2', 'Love the foot traffic here, best location for my store!', 4.8),
('subscriber1', 'The management system is super easy to use.', 4.2),
('admin1', 'Some stores need better signage for visibility.', 3.0),
('subscriber2', 'Utility bills are too high this month, please check.', 2.5);

UPDATE Shop SET shopowner = 'storeowner1' WHERE shop_no = 101;
UPDATE Shop SET shopowner = 'storeowner2' WHERE shop_no = 102;
UPDATE Shop SET shopowner = 'storeowner1' WHERE shop_no = 103;
UPDATE Shop SET shopowner = 'storeowner1' WHERE shop_no = 104;
UPDATE Shop SET shopowner = 'storeowner2' WHERE shop_no = 105;

UPDATE Shop SET status = 'vacant' WHERE shop_no = 104;
UPDATE Shop SET status = 'vacant' WHERE shop_no = 105;

-- Selecting All Tables
SELECT * FROM Shop;
SELECT * FROM Personnel;
SELECT * FROM TRANSACTIONS;
SELECT * FROM MONTHLY_RENT_PAYMENT;
SELECT * FROM STORE;
SELECT * FROM Rent;
SELECT * FROM UTILITY_BILL;
SELECT * FROM DAILY_STORE_REVENUE;
SELECT * FROM EMPLOYEE;
SELECT * FROM PAYROLL;
SELECT * FROM ATTENDANCE;
SELECT * FROM SUBSCRIPTION;
SELECT * FROM Feedback;

--Possible Select Queries

--(Get all vacant shops)
SELECT * FROM Shop WHERE status = 'vacant';

--(Total revenue per store)
SELECT store_id, SUM(total_earnings) AS total_revenue FROM DAILY_STORE_REVENUE GROUP BY store_id;

--(Active Stores List)
SELECT * FROM STORE WHERE status = 'active';


--######### Views #############

----------------------------------
-- FINANCIAL OVERVIEW OF STORE
----------------------------------

CREATE VIEW StoreFinancialOverview AS
SELECT 
    s.store_id,
    s.store_name,
    s.category,
    s.status AS store_status,
    sh.shop_no,
    sh.location,
    (SELECT SUM(total_earnings) 
     FROM DAILY_STORE_REVENUE dsr 
     WHERE dsr.store_id = s.store_id) AS total_revenue,
    (SELECT SUM(r.rent_amount)
     FROM MONTHLY_RENT_PAYMENT mrp
     JOIN Rent r ON mrp.shop_no = r.shop_no
     WHERE mrp.shop_no = s.shop_no) AS total_rent,
    (SELECT SUM(ub.amount)
     FROM UTILITY_BILL ub
     WHERE ub.shop_no = s.shop_no) AS total_bills,
    (SELECT SUM(total_earnings) 
     FROM DAILY_STORE_REVENUE dsr 
     WHERE dsr.store_id = s.store_id) - 
    ISNULL((SELECT SUM(r.rent_amount)
            FROM MONTHLY_RENT_PAYMENT mrp
            JOIN Rent r ON mrp.shop_no = r.shop_no
            WHERE mrp.shop_no = s.shop_no), 0) - 
    ISNULL((SELECT SUM(ub.amount)
            FROM UTILITY_BILL ub
            WHERE ub.shop_no = s.shop_no), 0) AS net_profit
FROM STORE s
JOIN Shop sh ON s.shop_no = sh.shop_no;

select * from StoreFinancialOverview

----------------------------------
-- SEE VACANT SHOPS
----------------------------------

CREATE VIEW VacantShops AS
SELECT shop_no, location 
FROM Shop 
WHERE status = 'vacant';

select * from VacantShops

----------------------------------
-- VIEW STORE REVENUE SUMMARY
----------------------------------

CREATE VIEW StoreRevenueSummary AS
SELECT s.store_id, s.store_name, SUM(dr.total_earnings) AS total_revenue
FROM STORE s
JOIN DAILY_STORE_REVENUE dr ON s.store_id = dr.store_id
GROUP BY s.store_id, s.store_name;

select * from StoreRevenueSummary

----------------------------------
-- SEE ACTIVE SUBSCRIPTIONS
----------------------------------

CREATE VIEW ActiveSubscriptions AS
SELECT mallowner_username, start_date, end_date, amount
FROM SUBSCRIPTION
WHERE status = 'active';

select* from ActiveSubscriptions

----------------------------------
-- SEE EMPLOYEES ATTENDANCE
----------------------------------

CREATE VIEW EmployeeAttendance AS
SELECT e.name,e.ssn,COUNT(a.attendance_id) AS days_present
FROM EMPLOYEE e
LEFT JOIN ATTENDANCE a ON e.ssn = a.ssn AND a.status = 'present'
GROUP BY e.name, e.ssn;

select * from EmployeeAttendance

----------------------------------
-- VIEW PENDING PAYMENTS IN MALL
----------------------------------

CREATE VIEW PendingPaymentsOverview AS
SELECT 
    'Rent' AS payment_type,
    mrp.shop_no AS reference_id,
    mrp.month_year,
    r.rent_amount AS amount_due,
    mrp.status
FROM MONTHLY_RENT_PAYMENT mrp
JOIN Rent r ON mrp.shop_no = r.shop_no
WHERE mrp.status = 'pending'
UNION ALL
SELECT 
    'Utility Bill' AS payment_type,
    ub.bill_id AS reference_id,
    ub.month_year,
    ub.amount AS amount_due,
    ub.status
FROM UTILITY_BILL ub
WHERE ub.status = 'pending'
UNION ALL
SELECT 
    'Payroll' AS payment_type,
    p.ssn AS reference_id,
    p.month_year,
    p.salary_paid AS amount_due,
    p.status
FROM PAYROLL p
WHERE p.status = 'pending';

select * from PendingPaymentsOverview

----------------------------------
-- OVERVIEW OF TRANSACTIONS
----------------------------------
CREATE VIEW transactionOverview AS
SELECT method, COUNT(*) AS total_payments, SUM(amount) AS total_amount
FROM TRANSACTIONS
GROUP BY method

SELECT * FROM transactionOverview

----------------------------------
-- SEE MOST PROFITABLE STORES
----------------------------------
CREATE VIEW profitableStores AS

SELECT S.store_name, S.shop_no, S.store_owner_username, S.category, S.status ,(D.total_earnings - R.rent_amount - SUM(U.amount)) AS StoreProfit 
FROM Rent AS R
JOIN UTILITY_BILL AS U
ON R.shop_no = U.shop_no
JOIN STORE AS S
ON U.shop_no = S.shop_no
JOIN DAILY_STORE_REVENUE AS D
ON S.store_id = D.store_id
WHERE S.status = 'active'
GROUP BY  S.store_name,  S.shop_no, S.store_owner_username, S.category, S.status, D.total_earnings, R.rent_amount;

SELECT * FROM profitableStores
ORDER BY StoreProfit DESC;


--######### Stored Procedures #############

--*****************************************
-- GET USER BY EMAIL
--*****************************************
CREATE PROCEDURE GET_USER_BY_EMAIL @email VARCHAR(255)
AS
BEGIN 
    SELECT * FROM Personnel
    WHERE Personnel.email = @email;
END;
GO

EXEC GET_USER_BY_EMAIL @email = 'ahmed.raza@mall.com';

--*****************************************
-- GET USER BY USERNAME
--*****************************************
CREATE PROCEDURE GET_USER_BY_USERNAME @username VARCHAR(100)
AS
BEGIN 
    SELECT * FROM Personnel
    WHERE Personnel.username = @username;
END;
GO

EXEC GET_USER_BY_USERNAME @username = 'subscriber1';


--*****************************************
-- UPDATE PASSWORD
--*****************************************
CREATE PROCEDURE UPDATE_USER_PASSWORD @password VARCHAR(255), @email VARCHAR(255)
AS
BEGIN
    UPDATE Personnel
    SET password = @password
    WHERE email = @email;
END;
GO

EXEC UPDATE_USER_PASSWORD 'NewPass999','admin1@mall.com';
--Verifying
SELECT * FROM Personnel WHERE email = 'admin1@mall.com';


--*****************************************
-- CHECK USER SUBSCRIPTION
--*****************************************
CREATE PROCEDURE CheckSubscription
@Email varchar(50),
@IsSubscribed int OUTPUT, 
@IsActive int OUTPUT
AS
BEGIN
SET @IsSubscribed = 0;
SET @IsActive = 0;

DECLARE @Username VARCHAR(100);
DECLARE @Status varchar (25);
DECLARE @StartDate date;
DECLARE @EndDate date;

SELECT @Username = username FROM Personnel 
WHERE email = @Email AND role = 'subscriber';

IF @Username IS NOT NULL
BEGIN
	print('User Is Subscribed');
    SET @IsSubscribed = 1;
    SELECT @StartDate = start_date, @EndDate = end_date FROM SUBSCRIPTION
    WHERE mallowner_username = @Username

	Select @Status= S.status from SUBSCRIPTION as S
	where s.mallowner_username=@Username
	AND end_date >= GETDATE()
    order by start_date DESC;

	IF @Status='active'
		BEGIN
			print('Subsciption Is Valid')
			PRINT 'Start Date: ' + CAST(@StartDate AS VARCHAR);
			PRINT 'End Date: ' + CAST(@EndDate AS VARCHAR);
			SET @IsActive = 1;
		END
	ELSE
		BEGIN
			print('Subsciption Is Expired')
		END
END
ELSE
	BEGIN
		print('There Is No Subscribed User With This Email')
	END
END;

DECLARE @IsSubscribed1 INT, @IsActive1 INT;
EXEC CheckSubscription 'bilal.hameed@mall.com', @IsSubscribed1 OUTPUT, @IsActive1 OUTPUT;
SELECT @IsSubscribed1 AS SubscriptionStatus, @IsActive1 AS ActiveStatus;

DECLARE @IsSubscribed2 INT, @IsActive2 INT;
EXEC CheckSubscription 'umer.hameed@mall.com', @IsSubscribed2 OUTPUT, @IsActive2 OUTPUT;
SELECT @IsSubscribed2 AS SubscriptionStatus, @IsActive2 AS ActiveStatus;

--Verifying
select * from Personnel
SELECT * FROM SUBSCRIPTION;


--*****************************************
-- CALCULATE TOTAL STORE REVENUE
--*****************************************
CREATE PROCEDURE GetTotalRevenue
    @store_id INT,
    @total_revenue DECIMAL(12,2) OUTPUT
AS
BEGIN
    SELECT @total_revenue = SUM(total_earnings)
    FROM DAILY_STORE_REVENUE
    WHERE store_id = @store_id;
END;

DECLARE @total_revenue DECIMAL(12,2);
EXEC GetTotalRevenue 1, @total_revenue OUTPUT;
SELECT @total_revenue AS TotalRevenue;


--*****************************************
-- REGISTER USER
--*****************************************
CREATE PROCEDURE RegisterUser
    @username VARCHAR(100),
    @email VARCHAR(255),
    @password VARCHAR(255),
    @role VARCHAR(15),
	@fname VARCHAR(100),
	@lname VARCHAR(100),
	@subadmin VARCHAR(100)
	AS
	BEGIN
	INSERT INTO Personnel
	(username,email,password,role,fname,lname,subadmin)
	VALUES
	(@username,@email,@password,@role,@lname,@fname,@subadmin)
	END

EXEC RegisterUser 
    @username = 'newuser10',
    @email = 'newuser10@mall.com',
    @password = 'NewPass1234',
    @role = 'subscriber',
    @fname = 'Murghi',
	@lname = 'Chor',
	@subadmin = 'NULL'



--*****************************************
-- LOGIN USER
--*****************************************
Create PROCEDURE LoginUser
    @email VARCHAR(255),
    @password VARCHAR(255),
    @accessToken VARCHAR(200) OUTPUT,
    @refreshToken VARCHAR(200) OUTPUT
AS
BEGIN
    -- Trim inputs to avoid space issues
    SET @email = TRIM(@email);
    SET @password = TRIM(@password);

    DECLARE @storedPassword VARCHAR(255);
    SELECT @storedPassword = password 
    FROM Personnel 
    WHERE email = @email;

    IF @storedPassword IS NULL
    BEGIN
        PRINT 'Email not found: ' + @email;
        RETURN 1;
    END;

    IF @storedPassword <> @password
    BEGIN
        PRINT 'Password mismatch. Stored: ' + @storedPassword + ', Provided: ' + @password;
        RETURN 1;
    END;

    DECLARE @username VARCHAR(100), @role VARCHAR(15);
    SELECT @username = username, @role = role 
    FROM Personnel 
    WHERE email = @email;

    SET @accessToken = CONCAT(@email, ':', @role, ':', @username);
    SET @refreshToken = NEWID();
    UPDATE Personnel SET refreshToken = @refreshToken WHERE email = @email;
END;

DECLARE @accessToken VARCHAR(200), @refreshToken VARCHAR(200);
EXEC LoginUser 
    @email = 'ahmed.raza@mall.com', 
    @password = 'AhmedPass456', 
    @accessToken = @accessToken OUTPUT, 
    @refreshToken = @refreshToken OUTPUT;
SELECT @accessToken AS AccessToken, @refreshToken AS RefreshToken;


--*****************************************
-- LOGOUT USER
--*****************************************
CREATE PROCEDURE LogoutUser
    @email VARCHAR(255)
AS
BEGIN
    UPDATE Personnel SET refreshToken = NULL WHERE email = @email;
END;

EXEC LogoutUser @email = 'ahmed.raza@mall.com';
SELECT refreshToken FROM Personnel WHERE email = 'ahmed.raza@mall.com';


--*****************************************
-- ALLOCATE A VACANT SHOP
--*****************************************
Create PROCEDURE AllocateShop
    @store_name VARCHAR(255),
    @shop_no INT,
    @store_owner_username VARCHAR(100),
    @category VARCHAR(100)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Shop WHERE shop_no = @shop_no AND status = 'vacant')
    BEGIN
        IF EXISTS (SELECT 1 FROM STORE WHERE shop_no = @shop_no)
        BEGIN
            -- Update existing store if shop is already in STORE
            UPDATE STORE
            SET store_name = @store_name,
                store_owner_username = @store_owner_username,
                category = @category,
                status = 'inactive'
            WHERE shop_no = @shop_no;
        END
        ELSE
        BEGIN
            
            INSERT INTO STORE (store_name, shop_no, store_owner_username, category, status)
            VALUES (@store_name, @shop_no, @store_owner_username, @category, 'inactive');
        END
        UPDATE Shop SET status = 'occupied' WHERE shop_no = @shop_no;
    END
    ELSE
        PRINT 'Shop not available';
END;

EXEC AllocateShop
    @store_name = 'Gadget Zone',
    @shop_no = 105,
    @store_owner_username = 'storeowner2',
    @category = 'Electronics';

	--Verifying
SELECT * FROM STORE WHERE shop_no = 105;
SELECT * FROM Shop WHERE shop_no = 105;


--*****************************************
-- UPDATE RENT AMOUNT
--*****************************************
CREATE PROCEDURE UpdateRent
    @shop_no INT,
    @new_rent DECIMAL(10,2)
AS
BEGIN
    UPDATE Rent
    SET rent_amount = @new_rent
    WHERE shop_no = @shop_no;
END;

EXEC UpdateRent @shop_no = 101, @new_rent = 55000;
SELECT * FROM Rent WHERE shop_no = 101;


--*****************************************
-- MARK BILL AS PAID
--*****************************************
CREATE PROCEDURE MarkBillPaid
    @bill_id INT,
    @transaction_id INT
AS
BEGIN
    UPDATE UTILITY_BILL
    SET status = 'paid', transaction_id = @transaction_id
    WHERE bill_id = @bill_id;
END;

EXEC MarkBillPaid @bill_id = 2, @transaction_id = 3;
SELECT * FROM UTILITY_BILL WHERE bill_id = 2;


--*****************************************
-- GET EMPLOYEE PAYROLL STATUS
--*****************************************
CREATE PROCEDURE GetPayrollStatus
    @ssn INT,
    @month_year DATE
AS
BEGIN
    SELECT e.name, p.salary_paid, p.status
    FROM EMPLOYEE e
    JOIN PAYROLL p ON e.ssn = p.ssn
    WHERE e.ssn = @ssn AND p.month_year = @month_year;
END;

EXEC GetPayrollStatus @ssn = 1001, @month_year = '2025-01-01';
SELECT * FROM PAYROLL WHERE ssn = 1001 AND month_year = '2025-01-01';


--*****************************************
-- APPROVE PENDING STORE
--*****************************************
CREATE PROCEDURE ApproveStore
    @store_id INT
AS
BEGIN
    UPDATE STORE SET status = 'active' WHERE store_id = @store_id AND status = 'inactive';
END;

EXEC ApproveStore @store_id = 5;
SELECT * FROM STORE WHERE store_id = 5;


--*****************************************
-- INSERT UTILITY BILL OF A STORE
--*****************************************
CREATE PROCEDURE AddBill
    @shop_no INT,
    @type VARCHAR(20),
    @amount DECIMAL(10,2),
    @month_year DATE
AS
BEGIN
    INSERT INTO UTILITY_BILL (shop_no, type, amount, status, month_year)
    VALUES (@shop_no, @type, @amount, 'pending', @month_year);
END;

EXEC AddBill 
    @shop_no = 105,
    @type = 'electricity',
    @amount = 6000,
    @month_year = '2025-03-01';

	--Verifying
SELECT * FROM UTILITY_BILL WHERE shop_no = 105;


--*****************************************
-- INSERT DAILY SALES OF A STORE
--*****************************************
CREATE PROCEDURE InsertDailySales
    @store_id INT,
    @total_earnings DECIMAL(12,2),
    @date DATE
AS
BEGIN
    INSERT INTO DAILY_STORE_REVENUE (store_id, total_earnings, date)
    VALUES (@store_id, @total_earnings, @date);
END;

EXEC InsertDailySales 
    @store_id = 1,
    @total_earnings = 300000,
    @date = '2025-03-01';

	--Verifying
SELECT * FROM DAILY_STORE_REVENUE WHERE store_id = 1;


--*****************************************
-- ADD CUSTOMER FEEDBACK
--*****************************************
CREATE PROCEDURE AddFeedback
    @username VARCHAR(100),
    @message TEXT,
    @rating DECIMAL(2,1)
AS
BEGIN
    INSERT INTO Feedback (username, message, rating)
    VALUES (@username, @message, @rating);
END;

EXEC AddFeedback 
    @username = 'storeowner1',
    @message = 'Improved parking, much better now!',
    @rating = 4.5;

	--Verifying
SELECT * FROM Feedback WHERE username = 'storeowner1';


--*****************************************
-- GENERATE MONTHLY PAYROLL
--*****************************************
CREATE PROCEDURE GenerateMonthlyPayroll
    @month_year DATE
AS
BEGIN
    INSERT INTO PAYROLL (ssn, month_year, salary_paid, status)
    SELECT 
        ssn,
        @month_year,
        salary,
        'pending'
    FROM EMPLOYEE
    WHERE NOT EXISTS (
        SELECT 1 FROM PAYROLL 
        WHERE ssn = EMPLOYEE.ssn AND month_year = @month_year
    );
END;

EXEC GenerateMonthlyPayroll @month_year = '2025-03-01';
SELECT * FROM PAYROLL WHERE month_year = '2025-03-01';


--*****************************************
-- STORE PROFIT CALCULATION
--*****************************************

CREATE PROCEDURE CalculateStoreProfitability
    @store_id INT,
    @start_date DATE,
    @end_date DATE,
    @profit DECIMAL(12,2) OUTPUT
AS
BEGIN
    DECLARE @revenue DECIMAL(12,2), @rent DECIMAL(12,2), @bills DECIMAL(12,2);

    SELECT @revenue = SUM(total_earnings)
    FROM DAILY_STORE_REVENUE
    WHERE store_id = @store_id AND date BETWEEN @start_date AND @end_date;

    SELECT @rent = SUM(r.rent_amount)
    FROM MONTHLY_RENT_PAYMENT mrp
    JOIN Rent r ON mrp.shop_no = r.shop_no
    JOIN STORE s ON mrp.shop_no = s.shop_no
    WHERE s.store_id = @store_id AND mrp.month_year BETWEEN @start_date AND @end_date;

    SELECT @bills = SUM(ub.amount)
    FROM UTILITY_BILL ub
    JOIN STORE s ON ub.shop_no = s.shop_no
    WHERE s.store_id = @store_id AND ub.month_year BETWEEN @start_date AND @end_date;

    SET @profit = ISNULL(@revenue, 0) - (ISNULL(@rent, 0) + ISNULL(@bills, 0));
END;


DECLARE @profit DECIMAL(12,2);
EXEC CalculateStoreProfitability 
    @store_id = 1,
    @start_date = '2025-01-01',
    @end_date = '2025-02-01',
    @profit = @profit OUTPUT
SELECT @profit AS Profit;

--Verifying
SELECT SUM(total_earnings) FROM DAILY_STORE_REVENUE WHERE store_id = 1 AND date BETWEEN '2025-01-01' AND '2025-02-01';
SELECT SUM(r.rent_amount) FROM MONTHLY_RENT_PAYMENT mrp JOIN Rent r ON mrp.shop_no = r.shop_no WHERE mrp.shop_no = 101 AND mrp.month_year BETWEEN '2025-01-01' AND '2025-02-01';
SELECT SUM(amount) FROM UTILITY_BILL WHERE shop_no = 101 AND month_year BETWEEN '2025-01-01' AND '2025-02-01';


--*****************************************
-- GET ALL THE BILLS FOR A PARTICULAR SHOP
--*****************************************
go
CREATE PROCEDURE getShopBills
@shop_number int
AS BEGIN

SELECT *
FROM UTILITY_BILL AS U
WHERE U.shop_no = @shop_number;

END

EXEC getShopBills 101


--*********************************************
-- UPDATE EMPLOYEE ATTENDANCE
--*********************************************
go
CREATE PROCEDURE SetAttendance
@emp_ssn int, @attendance_status varchar(10)
AS BEGIN

INSERT INTO ATTENDANCE (ssn, date, status)
SELECT @emp_ssn, GETDATE(), @attendance_status
WHERE NOT EXISTS (
    SELECT 1 FROM ATTENDANCE 
    WHERE ssn = @emp_ssn AND CAST(date AS DATE) = CAST(GETDATE() AS DATE)
);

END

EXEC SetAttendance 1002, 'absent'

--*********************************************
-- FEEDBACKS GIVEN BY A CUSTOMER
--*********************************************
go
CREATE PROCEDURE getCustomerFeedback
@customer_username varchar(50)
AS BEGIN

SELECT *
FROM Feedback AS F
WHERE F.username = @customer_username;

END

EXEC getCustomerFeedback 'subscriber1';

--*********************************************
-- DEACTIVATE A STORE
--*********************************************
CREATE PROCEDURE deactivateStore
@store_id int
AS BEGIN

UPDATE STORE
SET status = 'inactive' WHERE store_id = @store_id AND status = 'active';

END

EXEC deactivateStore 4