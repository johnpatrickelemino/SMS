using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

class backend
{
    public partial class OTP : Form
    {
        private static Dictionary<string, (string otp, DateTime expiry)> otpStorage = new Dictionary<string, (string, DateTime)>();
        public OTP()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void groupBox1_Enter(object sender, EventArgs e)
        {

        }




        private void button2_Click(object sender, EventArgs e)
        {
            string email = textBox1.Text;
            string otp = OOP.otp.Generate();


            otpStorage[email] = (otp, DateTime.Now.AddMinutes(1));
            email send = new email();
            send.SendEmail(email, otp);

        }

       

        private void button1_Click(object sender, EventArgs e)
        {
            string email = textBox1.Text;
            string userOTP = textBox2.Text;
            string otp = otpStorage.ContainsKey(email) ? otpStorage[email].otp : null;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(userOTP))
            {
                MessageBox.Show("Please enter both email and OTP.");
                return;
            }
            else if (otp == null)
            {
                MessageBox.Show("No OTP generated for this email.");
                return;
            }
            else if (otpStorage[email].expiry < DateTime.Now)
            {
                MessageBox.Show("OTP has expired.");
                return;
            }
            else if (userOTP == otp)
            {
                MessageBox.Show("OTP verified successfully.");
                this.Hide();
                Form5 form5 = new Form5();
                form5.Show();
            }
            else
            {
                MessageBox.Show("Invalid OTP. Please try again.");
            }


        }
    }
    
}