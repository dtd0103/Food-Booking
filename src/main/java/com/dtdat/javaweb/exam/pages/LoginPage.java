package com.dtdat.javaweb.exam.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {
	WebDriver driver;

	// Constructor
	public LoginPage(WebDriver driver) {
		this.driver = driver;
	}

	// Locators
	private By usernameField = By.id("username");
	private By passwordField = By.id("password");
	private By loginButton = By.cssSelector(".submit-btn");
	private By toastMessage = By.cssSelector(".toast-message");

	// Actions
	public void enterUsername(String username) {
		driver.findElement(usernameField).clear();
		driver.findElement(usernameField).sendKeys(username);
	}

	public void enterPassword(String password) {
		driver.findElement(passwordField).clear();
		driver.findElement(passwordField).sendKeys(password);
	}

	public void clickLogin() {
		driver.findElement(loginButton).click();
	}

	public boolean isToastDisplayed() {
		try {
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
			WebElement toast = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".toast-message")));
			return toast.isDisplayed();
		} catch (TimeoutException e) {
			return false;
		}
	}

	public boolean isUsernameErrorDisplayed() {
		try {
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3));
			WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.cssSelector("#username + .field-error-message")));
			return error.isDisplayed();
		} catch (TimeoutException e) {
			return false;
		}
	}

	public boolean isPasswordErrorDisplayed() {
		try {
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3));
			WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.cssSelector("#password + .field-error-message")));
			return error.isDisplayed();
		} catch (TimeoutException e) {
			return false;
		}
	}




	// Full login method
	public void login(String username, String password) {
		enterUsername(username);
		enterPassword(password);
		clickLogin();
	}
}
