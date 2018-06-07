<?php
/**
 * Routes configuration
 *
 * In this file, you set up routes to your controllers and their actions.
 * Routes are very important mechanism that allows you to freely connect
 * different URLs to chosen controllers and their actions (functions).
 *
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 */

use Cake\Core\Plugin;
use Cake\Routing\RouteBuilder;
use Cake\Routing\Router;
use Cake\Routing\Route\DashedRoute;

/**
 * The default class to use for all routes
 *
 * The following route classes are supplied with CakePHP and are appropriate
 * to set as the default:
 *
 * - Route
 * - InflectedRoute
 * - DashedRoute
 *
 * If no call is made to `Router::defaultRouteClass()`, the class used is
 * `Route` (`Cake\Routing\Route\Route`)
 *
 * Note that `Route` does not do any inflections on URLs which will result in
 * inconsistently cased URLs when used with `:plugin`, `:controller` and
 * `:action` markers.
 *
 */
Router::defaultRouteClass(DashedRoute::class);

/**
 * Load all plugin routes. See the Plugin documentation on
 * how to customize the loading of plugin routes.
 */
Plugin::routes();

Router::scope('/', function (RouteBuilder $routes) {

    // Login.
    $routes->connect(
        '/login',
        ['controller' => 'Login', 'action' => 'login'],
        ['_name' => 'login']
    );
    $routes->connect(
        '/logout',
        ['controller' => 'Login', 'action' => 'logout'],
        ['_name' => 'logout']
    );

    // Dashboard.
    $routes->connect(
        '/',
        ['controller' => 'Dashboard', 'action' => 'index'],
        ['_name' => 'dashboard']
    );

    // Profile.
    $routes->connect(
        '/profile',
        ['controller' => 'UserProfile', 'action' => 'view'],
        ['_name' => 'profile:view']
    );
    $routes->connect(
        '/profile/save',
        ['controller' => 'UserProfile', 'action' => 'save'],
        ['_name' => 'profile:save']
    );

    // Import.
    $routes->connect(
        '/import',
        ['controller' => 'Import', 'action' => 'index'],
        ['_name' => 'import:index']
    );
    $routes->connect(
        '/import/file',
        ['controller' => 'Import', 'action' => 'file'],
        ['_name' => 'import:file']
    );

    // Trash.
    $routes->connect(
        '/trash',
        ['controller' => 'Trash', 'action' => 'index', 'method' => 'GET'],
        ['_name' => 'trash:list']
    );
    $routes->connect(
        '/trash/view/:id',
        ['controller' => 'Trash', 'action' => 'view'],
        ['pass' => ['id'], '_name' => 'trash:view']
    );
    $routes->connect(
        '/trash/restore',
        ['controller' => 'Trash', 'action' => 'restore'],
        ['_name' => 'trash:restore']
    );
    $routes->connect(
        '/trash/delete',
        ['controller' => 'Trash', 'action' => 'delete'],
        ['_name' => 'trash:delete']
    );
    $routes->connect(
        '/trash/empty',
        ['controller' => 'Trash', 'action' => 'empty'],
        ['_name' => 'trash:empty']
    );

    // Modules.
    $routes->connect(
        '/:object_type',
        ['controller' => 'Modules', 'action' => 'index'],
        ['_name' => 'modules:list']
    );
    $routes->connect(
        '/:object_type/view/:id',
        ['controller' => 'Modules', 'action' => 'view'],
        ['pass' => ['id'], '_name' => 'modules:view']
    );
    $routes->connect(
        '/:object_type/view/:id/relatedJson/:relation',
        ['controller' => 'Modules', 'action' => 'relatedJson'],
        ['pass' => ['id', 'relation'], '_name' => 'modules:relatedJson']
    );
    $routes->connect(
        '/:object_type/view/:id/relationshipsJson/:relation',
        ['controller' => 'Modules', 'action' => 'relationshipsJson'],
        ['pass' => ['id', 'relation'], '_name' => 'modules:relationshipsJson']
    );
    $routes->connect(
        '/:object_type/view/:id/treeJson/:relation',
        ['controller' => 'Modules', 'action' => 'treeJson'],
        ['pass' => ['id', 'relation'], '_name' => 'modules:treeJson']
    );
    $routes->connect(
        '/:object_type/create',
        ['controller' => 'Modules', 'action' => 'create'],
        ['_name' => 'modules:create']
    );
    $routes->connect(
        '/:object_type/upload',
        ['controller' => 'Modules', 'action' => 'upload'],
        ['_name' => 'modules:upload']
    );
    $routes->connect(
        '/:object_type/save',
        ['controller' => 'Modules', 'action' => 'save'],
        ['_name' => 'modules:save']
    );
    $routes->connect(
        '/:object_type/delete',
        ['controller' => 'Modules', 'action' => 'delete'],
        ['_name' => 'modules:delete']
    );
    $routes->connect(
        '/:object_type/export',
        ['controller' => 'Export', 'action' => 'export'],
        ['_name' => 'export:export']
    );
    $routes->connect(
        '/:object_type/changeStatus',
        ['controller' => 'Modules', 'action' => 'changeStatus'],
        ['_name' => 'modules:changeStatus']
    );

    $routes->fallbacks(DashedRoute::class);
});
