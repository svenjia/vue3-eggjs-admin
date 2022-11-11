/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50740 (5.7.40-log)
 Source Host           : 127.0.0.1:3306
 Source Schema         : p10_permission

 Target Server Type    : MySQL
 Target Server Version : 50740 (5.7.40-log)
 File Encoding         : 65001

 Date: 09/11/2022 16:53:42
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for resources
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `parent_code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `uri` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '资源的uri',
  `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '方法，权限时候生效，如GET POST',
  `type` tinyint(4) NULL DEFAULT NULL COMMENT '资源类型 1 菜单 2权限 3 按钮',
  `is_show` tinyint(4) NULL DEFAULT NULL COMMENT '是否显示 0不显示 1显示',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注信息',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30184 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of resources
-- ----------------------------
INSERT INTO `resources` VALUES (30166, 'system', NULL, 'System', '/system', NULL, 1, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30167, 'system.user', 'system', 'UserAdmin', '/system/user', NULL, 1, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30168, 'system.user.create', 'system.user', 'createUser', '/user/create', 'POST', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30169, 'system.user.list', 'system.user', 'userList', '/user/list', 'GET', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30170, 'system.user.assign', 'system.user', 'userAssignRole', '/user/assign', 'POST', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30171, 'system.user.ban', 'system.user', 'userToggle', '/user/toggle', 'POST', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30172, 'system.user.destroy', 'system.user', 'destroyUser', '/user/destroy', 'POST', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30173, 'system.user.roles', 'system.user', 'userRoles', '/user/roles', 'GET', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30174, 'system.user.reset-password', 'system.user', 'resetPsw', '/user/reset-password', 'POST', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30175, 'system.role', 'system', 'roleAdmin', '/system/role', NULL, 1, 0, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30176, 'system.role.create', 'system.role', 'createRole', '/role/create', 'POST', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30177, 'system.role.list', 'system.role', 'roleList', '/role/list', 'GET', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30178, 'system.role.resources', 'system.role', 'getRoleResource', '/role/resources', 'GET', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30179, 'system.role.users', 'system.role', 'getRoleUsers', '/role/users', 'GET', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30180, 'system.role.destroy', 'system.role', 'delRole', '/role/destroy', 'POST', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30181, 'system.permission', 'system', 'Permission', '/system/permission', NULL, 1, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30182, 'system.resource.all', 'system.permission', 'getAllResource', '/resource/all', 'GET', 2, 1, NULL, '2022-11-09 16:20:46');
INSERT INTO `resources` VALUES (30183, 'system.resource.assign', 'system.permission', 'assignResource', '/resource/assign', 'POST', 2, 1, NULL, '2022-11-09 16:20:46');

-- ----------------------------
-- Table structure for role_resources
-- ----------------------------
DROP TABLE IF EXISTS `role_resources`;
CREATE TABLE `role_resources`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NULL DEFAULT NULL COMMENT '角色编号',
  `resource_code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 711 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_resources
-- ----------------------------

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色名字',
  `en_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色英文名字',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (7, 'test', NULL, 'test', '2022-11-01 16:34:56', '2022-11-01 16:34:56');
INSERT INTO `roles` VALUES (8, 'dfasdfa', NULL, 'adsfadsf', '2022-11-01 16:35:03', '2022-11-01 16:35:03');

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `role_id` int(11) NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES (10, 11, 7, '2022-11-01 16:35:10');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '帐号，只能有字母数字_-@.字符组成，不能包含其他特殊符号',
  `password_hash` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码的hash，默认为md5算法，hash需要和salt一起计算',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'email地址',
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号码，带区号，用-分割',
  `register_ip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '注册ip',
  `status` tinyint(4) UNSIGNED NULL DEFAULT 1 COMMENT '状态 1正常 0锁定',
  `exempt_time` int(11) NULL DEFAULT NULL COMMENT '释放时间，在这个时间之前，不能登录',
  `need_verify_code` tinyint(4) NULL DEFAULT 1 COMMENT '是否需要验证码，默认需要 1需要 0不需要',
  `salt` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '盐值，用于hash密码',
  `last_login_time` int(11) NULL DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最后登录ip',
  `password_wrong_times` tinyint(4) NULL DEFAULT NULL COMMENT '密码错误日数',
  `last_try_login_time` int(11) NULL DEFAULT NULL COMMENT '最后尝试登录的时间',
  `is_admin` tinyint(4) NULL DEFAULT 0 COMMENT '是否admin 0不是 1是',
  `deleted` tinyint(4) NULL DEFAULT 0 COMMENT '是否删除',
  `deleted_at` int(14) NULL DEFAULT NULL COMMENT '删除时间',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IX_account`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
