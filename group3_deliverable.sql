--########################################################################## CREATING DATABASE #####################################################################

create database MALL_MANAGEMENT_SYSTEM1;
Go

use MALL_MANAGEMENT_SYSTEM1;
Go

--########################################################################### CREATING TABLES #######################################################################

----------------------------------
-- Personnel Table
----------------------------------
CREATE TABLE Personnel(
username VARCHAR(100) NOT NULL primary key,
role varchar(15) check(role in ('store_owner','admin','subscriber')) not null,  --store_owner= customer, subscriber= subadmin
fname VARCHAR(100) NOT NULL,
lname VARCHAR(100) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL
);

ALTER TABLE Personnel add refreshToken varchar(200);
ALTER TABLE Personnel add subadmin varchar(100);
--Handle deleting of all it's related user when a subadmin account delete and also handle it in subscription expiry
ALTER TABLE Personnel add constraint fk_personnel foreign key(subadmin) references Personnel(username) on update NO ACTION on delete NO ACTION;

----------------------------------
-- Shop Table
----------------------------------
CREATE TABLE Shop(
shop_no INT PRIMARY KEY,
location VARCHAR(255) NOT NULL,
status varchar(10) check (status in('occupied','vacant')) DEFAULT 'vacant'
);

ALTER TABLE Shop add shopowner varchar(100)
ALTER TABLE Shop add constraint fk_shopowner foreign key(shopowner) references Personnel(username);
ALTER TABLE Shop drop constraint fk_shopowner
ALTER TABLE Shop add constraint fk_shopowner foreign key(shopowner) references Personnel(username) ON UPDATE CASCADE ON DELETE CASCADE;

----------------------------------
-- STORE Table
----------------------------------
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

----------------------------------
-- Rent Table
----------------------------------
CREATE TABLE Rent (
    shop_no INT PRIMARY KEY,
    rent_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (shop_no) REFERENCES Shop(shop_no) ON DELETE CASCADE
);

----------------------------------
-- TRANSACTIONS Table
----------------------------------
CREATE TABLE TRANSACTIONS (
    transaction_id INT PRIMARY KEY identity(1,1),
    amount DECIMAL(10,2) NOT NULL,
    method varchar(20) check (method in ('cash', 'credit_card', 'bank_transfer', 'UPI')) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    type varchar(20) check (type in ('rent', 'bill', 'miscellaneous')) NOT NULL,
    username varchar(100),  -- username of subscriber or store owner
    FOREIGN KEY (username) REFERENCES Personnel(username) ON DELETE SET NULL
);

----------------------------------
-- Monthly Rent Payments Table                       --To Track The Status Of Monthly Rents Of Shops
----------------------------------
CREATE TABLE MONTHLY_RENT_PAYMENT (
    payment_id INT PRIMARY KEY IDENTITY(1,1),
    shop_no INT,
    month_year DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('paid', 'pending')) DEFAULT 'pending',
    transaction_id INT,
    FOREIGN KEY (shop_no) REFERENCES Shop(shop_no) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES TRANSACTIONS(transaction_id) ON DELETE SET NULL
);

select * from rent
select * from MONTHLY_RENT_PAYMENT

----------------------------------
-- Utility Bills Table
----------------------------------
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

----------------------------------
-- Daily Store Revenue Table
----------------------------------
CREATE TABLE DAILY_STORE_REVENUE (
    revenue_id INT PRIMARY KEY IDENTITY(1,1),
    store_id INT,
    total_earnings DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (store_id) REFERENCES STORE(store_id) ON DELETE CASCADE
);

----------------------------------
-- Employee Table
----------------------------------
CREATE TABLE EMPLOYEE (
    ssn INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(12),
    role_id INT NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    subscriber VARCHAR(100),       -- Employee Owner
    FOREIGN KEY (subscriber) REFERENCES Personnel(username) ON DELETE SET NULL
);

SELECT 
    fk.name AS constraint_name
FROM 
    sys.foreign_keys fk
JOIN 
    sys.objects o ON fk.parent_object_id = o.object_id
WHERE 
    o.name = 'EMPLOYEE';

ALTER TABLE EMPLOYEE
DROP CONSTRAINT fk_subscriber

ALTER TABLE EMPLOYEE Add constraint fk_subscriber foreign key (subscriber) REFERENCES Personnel(username) ON DELETE CASCADE ON UPDATE CASCADE

----------------------------------
-- PAYROLL Table
----------------------------------
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

----------------------------------
-- Attendance Table
----------------------------------
CREATE TABLE ATTENDANCE (
    attendance_id INT PRIMARY KEY IDENTITY(1,1),
    ssn INT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(12) CHECK (status IN ('present', 'absent', 'leave')) NOT NULL,
    FOREIGN KEY (ssn) REFERENCES EMPLOYEE(ssn) ON DELETE CASCADE
);

----------------------------------
-- SUBSCRIPTION Table                                   --Handle subadmins subscriptiond from Admin
----------------------------------
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

----------------------------------
-- Feedback Table
----------------------------------
CREATE TABLE Feedback (
    feedback_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(100) NOT NULL,
    message TEXT,
    rating DECIMAL(2,1) NOT NULL,
    FOREIGN KEY (username) REFERENCES Personnel(username)
);

--Getting FK Contraint to alter Feedback Table
SELECT f.name AS FK_name
FROM sys.foreign_keys AS f
INNER JOIN sys.tables AS t ON f.parent_object_id = t.object_id
WHERE t.name = 'Feedback';

ALTER TABLE Feedback
DROP CONSTRAINT fk_feedbackowner

ALTER TABLE Feedback
ADD CONSTRAINT FK_Feedback_Personnel
FOREIGN KEY (username)
REFERENCES Personnel(username)
ON DELETE CASCADE ON UPDATE CASCADE;

SELECT 
    fk.name AS constraint_name
FROM 
    sys.foreign_keys fk
JOIN 
    sys.objects o ON fk.parent_object_id = o.object_id
WHERE 
    o.name = 'Feedback';

	ALTER TABLE Feedback DROP CONSTRAINT  FK_Feedback_Personnel

	ALTER TABLE Feedback add constraint fk_feedbackowner foreign key (username) REFERENCES Personnel(username) ON DELETE CASCADE


--############################################################################# INSERTING DATA ######################################################################################

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

--######################################################################### INSERTING DATA ####################################################################################

UPDATE Shop SET shopowner = 'storeowner1' WHERE shop_no = 101;
UPDATE Shop SET shopowner = 'storeowner2' WHERE shop_no = 102;
UPDATE Shop SET shopowner = 'storeowner1' WHERE shop_no = 103;
UPDATE Shop SET shopowner = 'storeowner1' WHERE shop_no = 104;
UPDATE Shop SET shopowner = 'storeowner2' WHERE shop_no = 105;

UPDATE Shop SET status = 'vacant' WHERE shop_no = 104;
UPDATE Shop SET status = 'vacant' WHERE shop_no = 105;


--######################################################################### DISPLAYING TABLES ##################################################################################

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

--######################################################################## SIMPLE QUERIES #############################################################################################

--(Get all vacant shops)
SELECT * FROM Shop WHERE status = 'vacant';

--(Total revenue per store)
SELECT store_id, SUM(total_earnings) AS total_revenue FROM DAILY_STORE_REVENUE GROUP BY store_id;

--(Active Stores List)
SELECT * FROM STORE WHERE status = 'active';

--############################################################################# TRANSACTIONS ##########################################################################################

----------------------------------------
-- TRANSACTION to Insert a Utility Bill
----------------------------------------
BEGIN TRANSACTION;
DECLARE @transaction_id INT;
INSERT INTO TRANSACTIONS (amount, method, payment_date, type, username)
VALUES (2000.00, 'cash', GETDATE(), 'bill', 'storeowner2');
SET @transaction_id = SCOPE_IDENTITY();

UPDATE UTILITY_BILL
SET status = 'paid', transaction_id = @transaction_id
WHERE shop_no = 102 AND type = 'water' AND month_year = '2025-01-01';

IF EXISTS (SELECT 1 FROM UTILITY_BILL WHERE shop_no = 104 AND type = 'internet' AND status = 'paid')
    COMMIT TRANSACTION;
ELSE
    ROLLBACK TRANSACTION;

select * from TRANSACTIONS
select * from UTILITY_BILL

---------------------------------------------
-- TRANSACTION to Record Employee Attendance
---------------------------------------------

BEGIN TRANSACTION;
INSERT INTO ATTENDANCE (ssn, date, status)
VALUES (1001, GETDATE(), 'absent');

IF EXISTS (SELECT 1 FROM ATTENDANCE WHERE ssn = 1001 AND date = GETDATE() AND status = 'absent')
    COMMIT TRANSACTION;
ELSE
    ROLLBACK TRANSACTION;

select * from ATTENDANCE

--############################################################################# TRIGGERS ###############################################################################################

---------------------------------------------
-- TRIGGER for Personnel Insertion
---------------------------------------------
CREATE TRIGGER trigger1
ON Personnel
AFTER INSERT
AS
BEGIN
   print('A New Personnel Has Been Added');
END;
GO

INSERT INTO Personnel (username, role, fname, lname, email, password) VALUES
('subsciber1', 'subscriber', 'Osman', 'Khan', 'admin123@mall.com', 'SecurePass1234')

select * from Personnel

-------------------------------------------------
-- TRIGGER for Automatically Changing Upper Case
-------------------------------------------------

CREATE TRIGGER trigger2
ON TRANSACTIONS
AFTER INSERT
AS
BEGIN
    UPDATE TRANSACTIONS
    SET method = UPPER(i.method)
    FROM TRANSACTIONS T
    INNER JOIN INSERTED i ON I.transaction_id = T.transaction_id;
END;
GO

INSERT INTO TRANSACTIONS (amount, method, payment_date, type, username) VALUES
(500000, 'cash', '2025-01-10', 'rent', 'storeowner1')

SELECT* from TRANSACTIONS

-------------------------------------------------
-- TRIGGER for Automatically Changing Upper Case
-------------------------------------------------
GO
CREATE TRIGGER trigger3
ON UTILITY_BILL
AFTER INSERT
AS
BEGIN
    UPDATE UTILITY_BILL
    SET amount = i.amount * 1.10
    FROM UTILITY_BILL u
    INNER JOIN INSERTED i ON u.bill_id = i.bill_id;
END;
GO

INSERT INTO UTILITY_BILL (shop_no, type, amount, transaction_id, status, month_year) VALUES
(101, 'internet', 5000, 3, 'pending', '2025-01-01')

select * from UTILITY_BILL



--############################################################################# VIEWS ###############################################################################################

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

---------------------------------------
-- Get Shops Whose Rents Are Pending
---------------------------------------
CREATE VIEW StoreRentStatus AS
SELECT S.shop_no, S.store_name, R.rent_amount
FROM MONTHLY_RENT_PAYMENT as M JOIN STORE as S ON S.shop_no=M.shop_no 
JOIN Rent as R on R.shop_no=S.shop_no
WHERE M.status = 'pending';

select * from StoreRentStatus
select * from MONTHLY_RENT_PAYMENT

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

------------------------------------------
-- Get No. Of Days An Employee Was Present
------------------------------------------
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

----------------------------------
-- View Shop Rent
----------------------------------
CREATE VIEW ShopRent
AS 
SELECT Shop.*,Rent.rent_amount
FROM Shop inner join Rent on Shop.shop_no=Rent.shop_no

select * from ShopRent

----------------------------------
-- View Store Rent
----------------------------------
CREATE VIEW StoresWithRent
AS
SELECT STORE.*,Rent.rent_amount,Shop.shopowner FROM STORE
inner join Shop on STORE.shop_no=Shop.shop_no
inner join Rent on Shop.shop_no=Rent.shop_no

select * from StoresWithRent

----------------------------------
-- Get Bills Status
----------------------------------
CREATE VIEW StoreBillsStatus AS
SELECT S.shop_no, S.store_name, U.amount
FROM UTILITY_BILL as U 
JOIN STORE as S 
ON S.shop_no=U.shop_no
WHERE U.status = 'pending';

select * from StoreBillsStatus

--####################################################################### STORED PROCEDURES ##########################################################################################


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

EXEC GET_USER_BY_USERNAME @username = 'subscriber2';

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
	@subadmin = 'subscriber2'

	select * from Personnel


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
            --Insert If No Existing Present
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
SELECT * FROM UTILITY_BILL WHERE bill_id = 3;


--*****************************************
-- GET EMPLOYEE PAYROLL UPTO DATE
--*****************************************
CREATE PROCEDURE GetPayrollStatusOfEmployees
    @employee_owner varchar(100),
    @current_date DATE
AS
BEGIN
    
    DECLARE @current_month INT = MONTH(@current_date);
    DECLARE @current_year INT = YEAR(@current_date);
    
    SELECT e.name AS employee_name, p.salary_paid, p.status, p.month_year
    FROM EMPLOYEE e
    JOIN PAYROLL p ON e.ssn = p.ssn
    WHERE e.subscriber = @employee_owner
      AND (
          (MONTH(p.month_year) = @current_month AND YEAR(p.month_year) = @current_year)
          OR (
              (YEAR(p.month_year) < @current_year OR 
               (YEAR(p.month_year) = @current_year AND MONTH(p.month_year) < @current_month))
              AND p.status = 'Pending'
          )
      )
    ORDER BY p.month_year DESC, e.name ASC;
END;

EXEC GetPayrollStatusOfEmployees 
    @employee_owner = 'storeowner1',
    @current_date = '2025-04-14';

--Verifying
	select * from EMPLOYEE
	select * from PAYROLL

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

	--Verifying
SELECT * FROM Feedback WHERE username = 'storeowner1';


--*****************************************
-- INSERT PAYROLL OF EMPLOYEES
--*****************************************
CREATE PROCEDURE GenerateMonthlyPayroll
	@subadmin_username varchar(100),
    @month_year DATE
AS
BEGIN

	INSERT INTO PAYROLL (ssn, month_year, salary_paid, status)
    SELECT ssn, @month_year, salary, 'pending'
    FROM EMPLOYEE
    WHERE subscriber = @subadmin_username
    AND ssn NOT IN (
        SELECT p.ssn 
        FROM PAYROLL p
        WHERE MONTH(p.month_year) = MONTH(@month_year)
        AND YEAR(p.month_year) = YEAR(@month_year)
    );

END;

EXEC GenerateMonthlyPayroll
    @subadmin_username = 'storeowner1',
    @month_year = '2025-04-14';

--Verifying
	select * from EMPLOYEE
	select * from PAYROLL


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
@emp_ssn int, @status varchar(10), @date DATE
AS BEGIN
	
	UPDATE ATTENDANCE
    SET status = @status
    WHERE ssn = @emp_ssn AND CAST(date AS DATE) = @date;

END

--*********************************************
-- FEEDBACKS GIVEN BY A CUSTOMER
--*********************************************
go
CREATE PROCEDURE get_Customers_Feedback_by_SubAdmin
@username varchar(100)
AS BEGIN

SELECT *
FROM Feedback
WHERE username IN(
SELECT P.username
FROM Personnel AS P
WHERE subadmin=@username
)
END

EXEC get_Customers_Feedback_by_SubAdmin 'subscriber2'
select* from Personnel
--*********************************************
-- Get Rent Status
--*********************************************

go
CREATE PROCEDURE getActiveRents
@shop_number int
AS BEGIN

SELECT *
FROM StoreRentStatus AS U
WHERE U.shop_no = @shop_number;

END

EXEC getActiveRents 103

GO

--*********************************************
-- De-Activate Store
--*********************************************

GO
CREATE PROCEDURE DeactivateStore
    @store_id INT
AS
BEGIN
    UPDATE STORE
    SET status = 'inactive'
    WHERE store_id = @store_id;
END;
GO

-- Test
EXEC DeactivateStore @store_id = 1;
SELECT * FROM STORE;


--*****************************
-- Get Most Profitable Stores
--*****************************

DECLARE @profit DECIMAL(12,2);
EXEC CalculateStoreProfitability 
    @store_id = 1,
    @start_date = '2025-01-01',
    @end_date = '2025-02-01',
    @profit = @profit OUTPUT
SELECT @profit AS Profit;


--*****************************************
-- Remove Store
--*****************************************

GO
CREATE PROCEDURE RemoveStore
    @store_id INT
AS
BEGIN
    DECLARE @shop_no INT;
    SELECT @shop_no = shop_no FROM STORE WHERE store_id = @store_id;
    
    DELETE FROM STORE WHERE store_id = @store_id;
    
    UPDATE Shop
    SET status = 'vacant', shopowner = NULL
    WHERE shop_no = @shop_no;
END;
GO

-- Test
EXEC RemoveStore @store_id = 2;
SELECT * FROM STORE;
SELECT * FROM Shop;

--*****************************************
-- Remove Customer
--*****************************************
GO
CREATE PROCEDURE RemoveCustomer
    @id VARCHAR(100)
AS
BEGIN
    DELETE FROM Personnel 
    WHERE username = @id AND role = 'subscriber';
END;
GO

-- Test
EXEC RemoveCustomer @id = 'subscriber1';
SELECT * FROM Personnel;

--*****************************************
-- Update Shop
--*****************************************
GO
CREATE PROCEDURE updateShop
    @shop_no INT,
    @location VARCHAR(255),
    @status VARCHAR(10),
    @shopowner VARCHAR(100)
AS
BEGIN
    UPDATE Shop
    SET location = @location,
        status = @status,
        shopowner = @shopowner
    WHERE shop_no = @shop_no;
END;
GO

-- Test
EXEC updateShop @shop_no = 101, @location = 'Ground Floor', @status = 'vacant', @shopowner = NULL;
SELECT * FROM Shop;

-- Test
EXEC updateShop @shop_no = 101, @location = 'Ground Floor', @status = 'vacant', @shopowner = NULL;
SELECT * FROM Shop;

--*****************************************
-- Delete Shop
--*****************************************
GO
CREATE PROCEDURE deleteShop
    @shop_no INT
AS
BEGIN
    DELETE FROM Shop WHERE shop_no = @shop_no;
END;
GO

-- Test
EXEC deleteShop @shop_no = 102;
SELECT * FROM Shop;


--*****************************************
-- Mall Total Revenue                          --Mall Revenue Will Be Rents
--*****************************************
GO
CREATE PROCEDURE GrossRevenueOfMall
    @date DATE,
    @subadmin_username VARCHAR(100)
AS
BEGIN
    SELECT ISNULL(SUM(R.rent_amount), 0) AS total_revenue
    FROM MONTHLY_RENT_PAYMENT as M
    JOIN Rent as R ON M.shop_no=R.shop_no
    JOIN Shop sh ON R.shop_no=sh.shop_no
    JOIN Personnel p ON sh.shopowner = p.username
    WHERE p.subadmin = @subadmin_username
    AND YEAR(M.month_year) = YEAR(@date)
    AND MONTH(M.month_year) = MONTH(@date)
END;
GO

-- Test
EXEC GrossRevenueOfMall @date = '2025-01-15', @subadmin_username = 'subscriber2';
select * from MONTHLY_RENT_PAYMENT
select * from Rent

--*****************************************
-- GET STORE BY ID
--*****************************************
CREATE PROCEDURE GET_STORE_BY_ID
    @store_id INT
AS
BEGIN
    Select *
	FROM STORE
	WHERE store_id=@store_id;
END;

--*****************************************
-- Expenses Of Mall                             --Mall Expense would be Bills, Salaries
--*****************************************

GO
CREATE PROCEDURE ExpensesOfMall
    @date DATE,
    @subadmin_username VARCHAR(100)
AS
BEGIN
    SELECT ISNULL(SUM(expense), 0) AS total_expenses
    FROM (
        SELECT ub.amount AS expense
        FROM Utility_Bill ub
        JOIN Shop sh ON ub.shop_no = sh.shop_no
        JOIN Personnel p ON sh.shopowner = p.username
        WHERE p.subadmin = @subadmin_username
		AND ub.status='pending'
        AND YEAR(ub.month_year) = YEAR(@date)
        AND MONTH(ub.month_year) = MONTH(@date)

        UNION ALL

        SELECT pr.salary_paid AS expense
        FROM Payroll pr
        JOIN Employee e ON pr.ssn = e.ssn
        JOIN Personnel p ON e.subscriber = p.username
        WHERE p.subadmin = @subadmin_username
		AND pr.status='pending'
        AND YEAR(pr.month_year) = YEAR(@date)
        AND MONTH(pr.month_year) = MONTH(@date)
    ) AS expenses;
END;
GO

-- Test
EXEC ExpensesOfMall @date = '2025-01-15', @subadmin_username = 'subscriber2';
select * from Personnel
select * from EMPLOYEE
select * from PAYROLL

--*****************************************
-- Get Active Subscriptions
--*****************************************

GO
CREATE PROCEDURE ActiveSubscriptionsOfMall
    @date DATE,
    @subadmin_username VARCHAR(100)
AS
BEGIN
    SELECT s.subscription_id, s.mallowner_username, s.start_date, s.end_date, s.amount
    FROM SUBSCRIPTION s
    JOIN Personnel p ON s.mallowner_username = p.username
    WHERE p.subadmin = @subadmin_username
    AND s.status = 'active'
    AND @date BETWEEN s.start_date AND s.end_date;
END;
GO

-- Test
EXEC ActiveSubscriptionsOfMall @date = '2025-01-15', @subadmin_username = 'subscriber2';

--*****************************************
-- All Subscriptions Of Mall
--*****************************************

GO
CREATE PROCEDURE AllSubscriptionsOfMall
    @date DATE,
    @subadmin_username VARCHAR(100)
AS
BEGIN
    SELECT s.subscription_id, s.mallowner_username, s.start_date, s.end_date, s.status, s.amount
    FROM SUBSCRIPTION s
    JOIN Personnel p ON s.mallowner_username = p.username
    WHERE p.subadmin = @subadmin_username;
END;
GO

-- Test
EXEC AllSubscriptionsOfMall @date = '2025-01-15', @subadmin_username = 'subscriber2';

--********************************************
-- DISPLAY MONTHLY PAYROLL OF EMPLOYEES
--********************************************

CREATE PROCEDURE IsPayrollGenerated
    @subadmin_username VARCHAR(100),
    @month_year DATE
AS
BEGIN
    SELECT p.ssn, e.name AS employee_name, p.salary_paid, p.status, p.month_year
    FROM PAYROLL p
    JOIN EMPLOYEE e ON p.ssn = e.ssn
    WHERE e.subscriber = @subadmin_username
      AND MONTH(p.month_year) = MONTH(@month_year)
      AND YEAR(p.month_year) = YEAR(@month_year);
END;
GO
EXEC IsPayrollGenerated @subadmin_username = 'storeowner1', @month_year = '2025-01-01';


select * from EMPLOYEE
select * from PAYROLL

--************************************************
-- INSERT ABSENT INTO ATTENDANCE AT SPECIFIC DATE
--************************************************

CREATE PROCEDURE GenerateAttendanceBySubadmin
    @subadmin_username VARCHAR(50),
    @date DATE
AS
BEGIN
    INSERT INTO ATTENDANCE (ssn, date, status)
    SELECT E.ssn, @date, 'Absent'
    FROM EMPLOYEE E
    WHERE E.subscriber = @subadmin_username
    AND NOT EXISTS (
        SELECT 1 FROM ATTENDANCE A
        WHERE A.ssn = E.ssn AND CAST(A.date AS DATE) = @date
    );
END;

EXEC GenerateAttendanceBySubadmin @subadmin_username = 'storeowner1', @date = '2025-05-14';

select * from ATTENDANCE
select * from EMPLOYEE

--*************************
-- GET EMPLOYEE BY EMAIL
--*************************
go
CREATE PROCEDURE GET_EMPLOYEE_BY_EMAIL
@email VARCHAR(255)
AS
BEGIN 
    SELECT * FROM EMPLOYEE AS E
    WHERE E.email = @email;
END;
GO
EXEC GET_EMPLOYEE_BY_EMAIL @email = 'ali.ahmed@mall.com';

--*********************
-- GET EMPLOYEE BY SSN
--*********************

go
CREATE PROCEDURE GET_EMPLOYEE_BY_SSN
@ssn int
AS
BEGIN 
    SELECT * FROM EMPLOYEE AS E
    WHERE E.ssn = @ssn;
END;
GO
EXEC GET_EMPLOYEE_BY_SSN @ssn = 1001;

--******************
-- ADD NEW EMPLOYEE
--******************
go
CREATE PROCEDURE addNewEmployee
@ssn INT, @name varchar(255), @email varchar(255), @phone varchar(12), 
@role_id int, @salary decimal (10, 2), @subscriber varchar(100)

AS BEGIN
	INSERT INTO EMPLOYEE
	VALUES
	(@ssn, @name, @email, @phone, @role_id, @salary, @subscriber)
END
EXEC addNewEmployee @ssn = 1006, @name = 'Fatima Noor',
@email = 'fatima.noor@mall.com', @phone = '03331234567',
@role_id = 6, @salary = 32000.00, @subscriber = 'storeowner1';

select * from EMPLOYEE

--*********************************
-- Match subadmin with personnel
--*********************************
CREATE PROCEDURE MatchCustomerSubadmin
    @subadmin VARCHAR(100),
    @customer VARCHAR(100),
    @foundFlag BIT OUTPUT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Personnel
        WHERE subadmin = @subadmin AND username = @customer
    )
    BEGIN
        SET @foundFlag = 1
    END
    ELSE
    BEGIN
        SET @foundFlag = 0
    END
END

--***************
-- Add Shop
--***************

CREATE PROCEDURE addShop @shop_no INT,@location VARCHAR(255), @status VARCHAR(10),@shopowner VARCHAR(100), @rent DECIMAL(10,2)
AS
BEGIN
INSERT INTO Shop
VALUES(@shop_no,@location,@status,@shopowner)

INSERT INTO  Rent
VALUES
(@shop_no,@rent)
END
EXEC addShop @shop_no = 106, @location = '2nd Floor - Near Entrance', @status = 'occupied', @shopowner = 'storeowner1', @rent = 15000.00;


--**************************
-- Match Shop and Subadmin
--**************************

CREATE PROCEDURE MatchShopNoAndSubAdmin @shop_no Int, @username VARCHAR(100)
AS
BEGIN
SELECT  TOP 1 * FROM Shop
where Shop.shopowner=@username and Shop.shop_no=@shop_no
END

--****************************************************
-- This procedure gets allocated shops for subadmin
--****************************************************

 CREATE PROCEDURE getAllocatedShop @username VARCHAR(100)
 AS
 BEGIN
 SELECT Shop.shop_no FROM Shop
 WHERE shopowner=@username and status='occupied'
 END


--*******************
-- Add Monthly Rent
--********************

  CREATE Procedure addMonthlyRent @shop_no INT
 AS
 BEGIN
 IF NOT EXISTS (
    SELECT 1 FROM MONTHLY_RENT_PAYMENT 
    WHERE shop_no = @shop_no 
      AND MONTH(month_year) = MONTH(GETDATE()) 
      AND YEAR(month_year) = YEAR(GETDATE())
)
BEGIN
    INSERT INTO MONTHLY_RENT_PAYMENT (shop_no, month_year, status)
    VALUES (@shop_no, GETDATE(), 'pending');
END
	END


 EXEC addMonthlyRent @shop_no='103'
 select * from MONTHLY_RENT_PAYMENT

 --*******************************
-- Get Active Bills
--*******************************
 GO
CREATE PROCEDURE getActiveBills
@shop_no INT
AS
BEGIN
    SELECT 
        U.shop_no, U.store_name, SUM(U.amount) AS amount
    FROM StoreBillsStatus AS U
    WHERE U.shop_no = @shop_no
    GROUP BY U.shop_no, U.store_name
END

--*******************************
-- Get Active Bills Shop By Shop
--*******************************

 CREATE PROCEDURE getActiveBillsByShop @shop_no int
AS
BEGIN
SELECT * FROM UTILITY_BILL
WHERE status='pending' and shop_no=@shop_no
END

exec getActiveBillsByShop @shop_no = 101
select * from UTILITY_BILL
select * from Shop

--*****************************************
-- GET SHOP BY SHOP NUMBER
--*****************************************

CREATE PROCEDURE GET_SHOP_BY_NUMBER
    @shop_no INT
AS
BEGIN
    Select *
	FROM Shop
    WHERE shop_no = @shop_no;
END;

--*************************
-- Month By Month Sales
--*************************

CREATE PROCEDURE GET_MONTH_BY_MONTH_SALES
AS
BEGIN
SELECT MONTH(SUBSCRIPTION.start_date) as Month,YEAR(SUBSCRIPTION.start_date) as YEAR,SUM(SUBSCRIPTION.amount) as totalSales
FROM SUBSCRIPTION
GROUP BY MONTH(SUBSCRIPTION.start_date),YEAR(SUBSCRIPTION.start_date)
END
exec GET_MONTH_BY_MONTH_SALES

  --***************************
-- Total Revenue By Subscriber
--*****************************

CREATE PROCEDURE GET_TOTAL_REVENUE_BY_SUBSCRIBER @username VARCHAR(100)
AS
BEGIN
SELECT SUBSCRIPTION.mallowner_username as username,SUM(SUBSCRIPTION.amount) as totalSales
FROM SUBSCRIPTION
GROUP BY SUBSCRIPTION.mallowner_username
having SUBSCRIPTION.mallowner_username=@username
END
EXEC GET_TOTAL_REVENUE_BY_SUBSCRIBER @username='subscriber2'

--use it while deleting customer

--***************
-- Remove User
--***************

CREATE PROCEDURE REMOVE_USER @username VARCHAR(100)
AS
BEGIN
delete from Personnel
where Personnel.username=@username
END

--************************
-- De Activate Subscription
--**************************

CREATE PROCEDURE DEACTIVATE_SUBSCRIPTION @subscription_id INT
AS
BEGIN
UPDATE SUBSCRIPTION
SET status='expired'
where subscription_id=@subscription_id
END

--*********************
--Get Subscribers Data
--*********************

CREATE PROCEDURE getSubscribersData 
AS
BEGIN
SELECT 
    P.fname,
    P.lname,      
    P.email,
    SUM(S.amount) AS total_subscription_paid
FROM SUBSCRIPTION AS S
INNER JOIN Personnel AS P 
    ON S.mallowner_username = P.username
GROUP BY 
    P.fname, P.lname, P.email;
	END

exec getSubscribersData

--********************************
-- Get Subscription between dates
--********************************

CREATE PROCEDURE getSubscriptionsBetweenDates @startDate DATE, @endDate DATE
AS
BEGIN

SELECT * FROM SUBSCRIPTION
WHERE SUBSCRIPTION.start_date  between @startDate and @endDate

END


SELECT * FROM Shop
SELECT * FROM Rent
SELECT * FROM Personnel

--****************************
-- GetMonthlyRentStatusByShop
--****************************

CREATE PROCEDURE GetMonthlyRentStatusByShop
    @shop_no INT
AS
BEGIN
    SELECT *, 
           CASE 
               WHEN status = 'pending' THEN 1 
               WHEN status = 'paid' THEN 2 
               ELSE 3 
           END AS sort_order
    FROM MONTHLY_RENT_PAYMENT
    WHERE shop_no = @shop_no
    ORDER BY sort_order, month_year;
END;

exec GetMonthlyRentStatusByShop 103

--*************************
-- Pending Rents Of Stores
--*************************

CREATE PROCEDURE getAllPendingRentsOfStore
@shop_no INT
AS BEGIN
	Select * 
	FROM MONTHLY_RENT_PAYMENT
	WHERE shop_no=@shop_no AND status='pending'
END

--***************************************************
-- Get all pending utility bills list for a store
--***************************************************

CREATE PROCEDURE getAllPendingBillsOfStore
@shop_no INT
AS BEGIN
	Select * 
	FROM UTILITY_BILL
	WHERE shop_no=@shop_no AND status='pending'
END

--**********************
-- Total Store Revenue
--**********************
CREATE PROCEDURE TotalStoreRevenue
    @shop_no INT
AS
BEGIN
    SELECT SUM(D.total_earnings) AS total_revenue
    FROM Store AS S
    INNER JOIN DAILY_STORE_REVENUE AS D 
	ON S.store_id = D.store_id
    WHERE S.shop_no = @shop_no;
END
GO

--***********************
-- StoreRevenueEachMonth
--***********************

CREATE PROCEDURE StoreRevenueEachMonth
    @shop_no INT
AS
BEGIN
    SELECT 
        FORMAT(D.date, 'yyyy-MM') AS MonthYear,
        SUM(D.total_earnings) AS MonthlyRevenue
    FROM Store AS S
    INNER JOIN DAILY_STORE_REVENUE AS D ON S.store_id = D.store_id
    WHERE S.shop_no = @shop_no
    GROUP BY FORMAT(D.date, 'yyyy-MM')
    ORDER BY FORMAT(D.date, 'yyyy-MM');
END
GO

--*******************
-- Pay Pending Bill
--*******************

CREATE PROCEDURE payPendingBill
  @amount DECIMAL(10, 2), @method VARCHAR(20), @type VARCHAR(20), @bill_type varchar(20), @username VARCHAR(255), @shop_no INT, @month_year DATE
AS --ye amount backend wali jo hogi, wohi daalni he
BEGIN
  DECLARE @transaction_id INT;

  INSERT INTO TRANSACTIONS (amount, method, payment_date, type, username)
  VALUES (@amount, @method, GETDATE(), @type, @username);

  SET @transaction_id = SCOPE_IDENTITY();


  UPDATE UTILITY_BILL
  SET status = 'paid', transaction_id = @transaction_id
  WHERE month_year = @month_year AND shop_no = @shop_no AND type=@bill_type;
END


--*******************
-- Pay Monthly Rent
--*******************

CREATE PROCEDURE payMonthlyRent

 @amount DECIMAL(10, 2), @method VARCHAR(20), @type VARCHAR(20), @username VARCHAR(255), @shop_no INT, @month_year DATE
AS BEGIN
	 DECLARE @transaction_id INT;

	INSERT INTO TRANSACTIONS (amount, method, payment_date, type, username)
	  VALUES (@amount, @method, GETDATE(), @type, @username);

	  SET @transaction_id = SCOPE_IDENTITY();

	  UPDATE MONTHLY_RENT_PAYMENT
	  SET status = 'paid', transaction_id = @transaction_id
	  WHERE month_year = @month_year AND shop_no = @shop_no;

END

--***************
-- Get Customer
--***************

CREATE PROCEDURE getCustomer @username VARCHAR(100)
AS
BEGIN
SELECT P.fname,P.lname,P.email,P.username,P.role FROM Personnel as P
WHERE P.subadmin=@username
END


--**********************
-- Monthly Rent Payment
--**********************

CREATE PROCEDURE getMonthlyRentPayment @username Varchar(100)
AS
BEGIN
SELECT * FROM Shop
inner join MONTHLY_RENT_PAYMENT on Shop.shop_no=MONTHLY_RENT_PAYMENT.shop_no and Shop.shopowner=@username
where MONTH(month_year)=MONTH(GETDATE()) and YEAR(month_year)=YEAR(GETDATE())
UNION 
SELECT * FROM Shop
inner join MONTHLY_RENT_PAYMENT on Shop.shop_no=MONTHLY_RENT_PAYMENT.shop_no and Shop.shopowner='ghani'
where MONTHLY_RENT_PAYMENT.status='pending'
END

exec getMonthlyRentPayment storeowner1