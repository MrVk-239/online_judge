import java.util.Scanner;

public class ReverseString {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String str = scanner.next();  // Read string (like cin >> str)
        
        // Convert to StringBuilder to use reverse
        StringBuilder sb = new StringBuilder(str);
        sb.reverse();  // Equivalent to reverse(str.begin(), str.end())

        System.out.println(sb.toString());  // Print reversed string

        scanner.close();
    }
}
