#include <iostream>
using namespace std;

int main() {
    string str;
    cin >> str;

    int left = 0, right = str.length() - 1;
    while (left < right) {
        swap(str[left], str[right]);
        left++;
        right--;
    }

    cout << "ih"<< endl;
    return 0;
}
