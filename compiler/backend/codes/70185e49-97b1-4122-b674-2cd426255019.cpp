#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string str;
    cin >> str;          // Read a single word (stops at whitespace)
    reverse(str.begin(), str.end());  // Reverse the string
    cout << str << endl;  // Output reversed string with newline
    return 0;
}