# README: Springfield Financial Services Ltd Website

## Project Overview

This project is a high-performance, responsive business website for **Springfield Financial Services Ltd**, a financial firm specializing in fast, collateral-free loans for Small and Medium-Sized Businesses (SMBs) in emerging markets. The platform is designed to bridge the funding gap for entrepreneurs in Africa, Latin America, and Southeast Asia by providing transparent, global-standard debt financing.

## Core Features

* **Loan Application Portal:** A secure, multi-step digital form for users to submit personal and business details, request specific loan amounts, and upload required documentation (IDs, bank statements).
* **Interactive Loan Calculator:** A real-time tool that allows potential borrowers to estimate monthly payments based on a 12% APR.
* **Admin Dashboard:** A protected management interface featuring:
* **Live Application Tracking:** A dynamic table to monitor submitted loan requests.
* **Data Analytics:** Visual trends of application volume using Chart.js.
* **Data Export:** Capability to export applicant data to CSV, Excel, and PDF formats.


* **Comprehensive Product Suite:** Detailed sections for Working Capital, Equipment Finance, Expansion Capital, and Invoice Financing.

## Tech Stack

* **Frontend:** HTML5, Tailwind CSS (for modern, utility-first styling), and Vanilla JavaScript.
* **Data Visualization:** Chart.js for dashboard analytics.
* **Storage:** LocalStorage (simulated backend for form persistence and admin retrieval).
* **File Processing:** XLSX and jsPDF libraries for administrative reporting.

## Project Structure

* `index.html`: The primary landing page featuring the value proposition, "Our Story," and success stories.
* `apply.html`: The digital loan application interface with built-in validation and "honeypot" spam protection.
* `admin.html`: The secure administrative portal for reviewing and exporting applications.
* `style.css`: The central design system containing custom variables and global component styles.
* `script.js`: Interactive logic for smooth scrolling and the monthly payment calculator.

## Installation & Usage

1. Clone the repository to your local machine.
2. Open `index.html` in any modern web browser to view the public site.
3. To access the **Admin Dashboard**:
* Navigate to `admin.html`.
