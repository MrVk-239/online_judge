#include <iostream>
#include <algorithm> // for std::reverse
using namespace std;

int main() {
    string str = "hello";
    reverse(str.begin(), str.end());
    cout << "Reversed string: " << str << endl;
    return 0;
}
