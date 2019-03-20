from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as cond
from selenium.common.exceptions import TimeoutException
print("trying to open page...")  
browser = webdriver.Firefox()
browser.get("http://localhost:8080/login")
  
username = browser.find_element_by_id("email")
password = browser.find_element_by_id("password")
submit   = browser.find_element_by_name("submit")
  
username.send_keys("uasdfiuh@sdf.com")
password.send_keys("uma")
  
submit.click()
  
try:
    # Wait as long as required, or maximum of 10 sec for alert to appear
    WebDriverWait(browser,10).until(cond.title_is("Home - Brand"))
    print ("Successful login!")
except TimeoutException:
    print("Loading timeout expired")
  
