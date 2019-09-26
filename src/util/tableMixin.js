export default {
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleLook(index, row) {
      this.Look(row.id);
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialogTitle = "查看";
    },
    handleEdit(index, row) {
      this.Look(row.id);
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialogTitle = "编辑";
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.DeleteSingel(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    add() {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialogTitle = "新增";

    },
    deleteSome() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选中任何项",
          type: "warning"
        });
      } else {
        //批量删除
        let str = "";
        for (let val of this.multipleSelection) {
          str += val.id + ",";
        }
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.DeleteSome({ ids: str });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    search() {
      let json = {};
      json[this.searchInput.condition] = this.searchInput.keyword;
      json.selectType = this.searchInput.include;
      this.Search(this.currentPage, this.currentSize, json);
    },
    dialogFormCancel() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleClose() {
      this.clearFormStatus();
    },
    clearFormStatus() {
      //置空所有input
      for (let key in this.formLabelAlign) {
        this.formLabelAlign[key] = "";
      }
      //置空fileList
      if (this.hasOwnProperty("fileList")) {
        this.fileList = [];
      }
    },
    dialogOk() {
      if (this.dialogTitle == "新增") {
        //表单验证阶段
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            this.Add(this.formLabelAlign);
          } else {
            return false;
          }
        });
      } else if (this.dialogTitle == "编辑") {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            this.Edit(this.formLabelAlign);
          } else {
            return false;
          }
        });
      }
      debugger
    },
    handleSizeChange(val) {
      this.currentSize = val;
      //一旦切换当前页展示数目,那么当页currentPage默认跳转回地1页
      this.getTableData(1, val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData(val, this.currentSize);
    },
    /**
     * 图片上次处理函数
     */
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove(file, fileList) {
      //!必要的判断!主要解决上传未保存就删除的操作
      let delId; //被删除的图片id
      if (file.hasOwnProperty("response")) {
        delId = file.response.data;
      } else {
        delId = file.url.split("/")[5];
      }
      for (let index in this.uploadImgIds) {
        if (this.uploadImgIds[index] == delId) {
          this.uploadImgIds.splice(index, 1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialog = true;
    },
    uploadSucc(res, file, fileList) {
      this.uploadImgIds = []; //!必须置空,否则会叠加之前已经上传过的图

      fileList.forEach(element => {
        if (element.hasOwnProperty("response")) {
          this.uploadImgIds.push(element.response.data);
        } else {
          this.uploadImgIds.push(element.url.split("/")[5]);
        }
      })
    },
    handleClose() {
      // this.$refs["ruleForm"].clearValidate();
      this.$refs.ruleForm.resetFields()
    },
 

    // clearFormStatus() {
    //     //置空表单

    //     if (!this.$refs.hasOwnProperty("generateForm")) {
    //         return;
    //     } else {
    //         this.$refs.generateForm.getData().then(data => {
    //             for (let key in data) {
    //                 data[key] = "";
    //             }
    //         });
    //     }
    //     //置空图片
    //     this.$emit("clearImgs");
    // }



    // if (this.formLabelAlign[key] == "") {
    //   switch (key) {
    //     case "factorynumber":
    //       this.$message({
    //         showClose: true,
    //         message: '出厂编号不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "planeType":
    //       this.$message({
    //         showClose: true,
    //         message: '飞机型号不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "deliverytime":
    //       this.$message({
    //         showClose: true,
    //         message: '出厂日期不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "servicedate":
    //       this.$message({
    //         showClose: true,
    //         message: '服役日期不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "unitnumber":
    //       this.$message({
    //         showClose: true,
    //         message: '所属部队编号不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "unitmiddle":
    //       this.$message({
    //         showClose: true,
    //         message: '所属中队不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "usernumber":
    //       this.$message({
    //         showClose: true,
    //         message: '使用机号不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "fightweight":
    //       this.$message({
    //         showClose: true,
    //         message: '标准作战重量不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "maxoverdrive":
    //       this.$message({
    //         showClose: true,
    //         message: '最大限制过载不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "emptyweight":
    //       this.$message({
    //         showClose: true,
    //         message: '空机重量不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "strengthweight":
    //       this.$message({
    //         showClose: true,
    //         message: '强度设计重量不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "sn":
    //       this.$message({
    //         showClose: true,
    //         message: 'S-N指数不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //     case "maxdesignoverdrive":
    //       this.$message({
    //         showClose: true,
    //         message: '最大设计过载不能为空！',
    //         type: 'warning'
    //       });
    //       break;
    //   }
    // }
  }

}
