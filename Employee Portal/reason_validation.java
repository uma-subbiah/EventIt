import java.util.Scanner;

public class reason_validation {

	static float BankBalance = 10000; //Will be retrieved from the bank
	
	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		String reason = sc.nextLine();	//In real time, will be implemented by retrieving the value from the database, after the customer has filled the cancellation form
		
		float amountPaid = sc.nextFloat();
		int reasonCode = encode(reason);
		boolean refundable = false;
		
		switch(reasonCode)
		{
			case -1:
			case 2:
				break;
			default:
			refundable = true;
		}
		if(refundable)
		{
			contactBank(amountPaid,0);
		}
		else
		{
			imposeFine(amountPaid);
		}
	}

	private static void imposeFine(float amountPaid) {
		float refundAmt = 0.0f;
		contactBank(refundAmt, (float)1.5*amountPaid);
	}

	private static void contactBank(float refundAmt, float fine) {
		BankBalance += refundAmt;
		BankBalance -= fine;
		informCustomer();
	}

	private static void informCustomer() {
		// This method will implement a method to send OTPs to the customer at a later stage of the sprint
	}

	private static int encode(String reason) {
		if(reason.equals("Emergency"))
			return 1;
		if(reason.equals("False report"))
			return 2;
		if(reason.equals("Company's Fault"))
			return 3;
		if(reason.equals("Caterer's Fault"))
			return 4;
		else
			return -1;
	}

}
