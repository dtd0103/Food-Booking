package com.dtdat.javaweb.exam.selenium;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.dtdat.javaweb.exam.pages.LoginPage;

import io.github.bonigarcia.wdm.WebDriverManager;

public class LoginTest {
	WebDriver driver;
	LoginPage loginPage;

	@BeforeMethod
	public void setUp() {

		WebDriverManager.chromedriver().setup();

		ChromeOptions options = new ChromeOptions();
		// options.addArguments("--headless"); // run without open browser
		options.addArguments("--force-device-scale-factor=1");
		options.addArguments("--window-size=1920,1080");
		driver = new ChromeDriver(options);
		driver.get("http://localhost:8080/login.html");
		driver.manage().window().maximize();

		loginPage = new LoginPage(driver);
	}

	@Test
	public void testEmptyLogin() {
		loginPage.clickLogin();
		Assert.assertTrue(loginPage.isUsernameErrorDisplayed(), "Username error should appear");
		Assert.assertTrue(loginPage.isPasswordErrorDisplayed(), "Password error should appear");
	}

	@Test
	public void testInvalidLogin() {
		loginPage.login("wronguser", "wrongpass");
		Assert.assertTrue(loginPage.isToastDisplayed(), "Toast should appear for invalid login");
	}

	@Test
	public void testValidLogin() {
		loginPage.login("admin", "admin");
		String currentUrl = driver.getCurrentUrl();
		Assert.assertTrue(currentUrl.contains("admin") || currentUrl.contains("dashboard"),
				"Should navigate to home/dashboard after valid login");
	}

	@AfterMethod
	public void tearDown() {
		if (driver != null) {
			driver.quit();
		}
	}
}
