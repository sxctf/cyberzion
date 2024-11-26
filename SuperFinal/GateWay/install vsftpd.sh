#!/bin/bash
apt-get -y install git libnsl-dev gcc make linux-libc-dev linux-headers-generic
git clone https://github.com/clintmint/vsftpd-2.3.4-container.git
cd ./vsftpd-2.3.4-container/vsftpd-2.3.4
#mkdir /usr/include/sys
#touch /usr/include/sys/unistd.h
#echo "#include <unistd.h>" > /usr/include/sys/unistd.h
sed -i 's/LINK  =       -Wl,-s/LINK     =       -Wl,-s,-lcrypt/g' Makefile
sed -i '/#define VSF_SYSDEP_HAVE_UTMPX/d' sysdeputil.c
make
cp vsftpd.conf /etc
sed -i 's/anonymous_enable=YES/anonymous_enable=NO/g' /etc/vsftpd.conf
sed -i 's/#local_enable=YES/local_enable=YES/g' /etc/vsftpd.conf
mkdir /var/lib/ftp
mkdir /usr/share/empty
cp ./vsftpd /bin/vsftpd
chmod 770 /bin/vsftpd
cp ./start-vsftpd.sh /bin/start-vsftpd
chmod 770 /bin/start-vsftpd
/bin/start-vsftpd

