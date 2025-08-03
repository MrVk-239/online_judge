import java.util.Scanner;

public class ReverseString {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Read input string
        String input = scanner.nextLine();
        
        // Reverse using StringBuilder
        String reversed = new StringBuilder(input).reverse().toString();
        
        // Print reversed string
        System.out.println(reversed);
        
        scanner.close();
    }
}
