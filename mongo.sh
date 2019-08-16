#!/bin/sh
echo "检测mongod是否启动如果没有启动则自动启动"
echo 
echo 

pgrep mongo -l
if [ $? -eq 1 ];then
 echo "mongod 启动中..."
 sudo service mongod start
fi


