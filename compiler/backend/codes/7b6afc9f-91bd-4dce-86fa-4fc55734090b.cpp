#include <iostream>
using namespace std;

int main() {
    string str;
    cout << "Enter a string: ";
    cin >> str;

    int left = 0, right = str.length() - 1;
    while (left < right) {
        swap(str[left], str[right]);
        left++;
        right--;
    }

    cout << "Reversed string: " << str << endl;
    return 0;
}
