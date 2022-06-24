sudo systemctl stop nginx
rm -rf /var/www/html/
cp -a build/. /var/www/html/
sudo systemctl start nginx
echo "Complete"
